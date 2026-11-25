"use strict";
// Vault-local plugin; no network or external dependencies.
const DIR="Attachments/diagrams/pasted",MAX_BYTES=524288,MAX_PASTE=2097152,MAX_IMAGES=20;
function findImages(markdown){
  const out=[];let offset=0,fence=null,ticks=0,yaml=false;
  for(const [index,line] of markdown.split("\n").entries()){
    const plain=line.replace(/\r$/,"");
    if(index===0&&plain==="---"){yaml=true;offset+=line.length+1;continue;}
    if(yaml){if(/^(---|\.\.\.)$/.test(plain))yaml=false;offset+=line.length+1;continue;}
    const mark=plain.match(/^\s*(?:>\s*)*(?:(?:[-+*]|\d+[.)])\s+)?(`{3,}|~{3,})(.*)$/);
    if(mark){if(!fence){fence=mark[1];ticks=0;}else if(mark[1][0]===fence[0]&&mark[1].length>=fence.length&&!mark[2].trim())fence=null;offset+=line.length+1;continue;}
    if(fence||/^(?: {4}|\t)/.test(line)){offset+=line.length+1;continue;}
    for(let i=0;i<line.length;){
      if(line[i]==="\\"){i+=2;continue;}
      if(line[i]==="`"){let j=i+1;while(line[j]==="`")j++;if(!ticks)ticks=j-i;else if(ticks===j-i)ticks=0;i=j;continue;}
      if(ticks||line[i]!=="!"){i++;continue;}
      const m=line.slice(i).match(/^!\[([^\]\r\n]*)\]\((data:image\/svg\+xml(?:;[a-zA-Z0-9=._+-]+)*,)/i);
      if(!m){i++;continue;}
      let j=i+m[0].length,depth=1;
      for(;j<line.length;j++){if(line[j]==="\\"){j++;continue;}if(line[j]==="(")depth++;else if(line[j]===")"&&--depth===0)break;}
      if(j>=line.length){i++;continue;}
      const uri=line.slice(i+4+m[1].length,j),width=m[1].match(/(?:^|\|)(\d{1,4})$/),alt=width?m[1].slice(0,-width[0].length):m[1];
      if(!/[\[\]|]/.test(alt))out.push({from:offset+i,to:offset+j+1,uri,alt,width:width?Math.max(1,Math.min(2000,+width[1])):350});
      i=j+1;
    }
    offset+=line.length+1;
  }
  return out;
}

function decodeSvg(uri){
  const m=uri.match(/^data:image\/svg\+xml((?:;[a-zA-Z0-9=._+-]+)*),([\s\S]*)$/i);
  if(!m||uri.length>MAX_BYTES*3)throw Error("SVG 형식/크기 오류");
  const payload=decodeURIComponent(m[2].replace(/\\([()\\])/g,"$1"));
  const svg=/;base64(?:;|$)/i.test(m[1])?Buffer.from(payload,"base64").toString("utf8"):payload;
  if(!svg.trim()||encodeURIComponent(svg).replace(/%[0-9a-f]{2}/gi,"x").length>MAX_BYTES)throw Error("SVG 크기 제한");
  return svg;
}

function normalizeSvg(raw){
  if(/<!DOCTYPE|<!ENTITY|<\?(?!xml\s)/i.test(raw))throw Error("외부 XML 선언 금지");
  const doc=new DOMParser().parseFromString(raw,"image/svg+xml"),root=doc.documentElement,ns="http://www.w3.org/2000/svg";
  if(!root||root.localName!=="svg"||root.namespaceURI!==ns||doc.getElementsByTagName("parsererror").length)throw Error("SVG XML 오류");
  const tags=new Set("svg g defs text tspan rect circle ellipse line polyline polygon path marker clipPath mask linearGradient radialGradient stop pattern title desc".split(" "));
  const attrs=new Set("id xmlns viewBox width height x y x1 y1 x2 y2 cx cy r rx ry d points transform fill fill-opacity fill-rule stroke stroke-width stroke-opacity stroke-linecap stroke-linejoin stroke-dasharray stroke-dashoffset stroke-miterlimit opacity font-family font-size font-weight font-style text-anchor dominant-baseline alignment-baseline dx dy textLength lengthAdjust letter-spacing word-spacing preserveAspectRatio marker-start marker-mid marker-end markerWidth markerHeight markerUnits refX refY orient clip-path clipPathUnits clip-rule mask maskUnits maskContentUnits gradientUnits gradientTransform offset stop-color stop-opacity fx fy fr spreadMethod patternUnits patternContentUnits patternTransform vector-effect paint-order color role aria-label aria-hidden".split(" "));
  const nodes=[root,...root.querySelectorAll("*")];if(nodes.length>5000)throw Error("SVG 요소 제한");
  let themed=false;
  for(const el of nodes){
    if(el.namespaceURI!==ns||!tags.has(el.localName))throw Error("지원하지 않는 SVG 요소: "+el.localName);
    for(const {name,value,namespaceURI} of [...el.attributes]){
      if(name==="data-d-component"||name==="data-component"){el.removeAttribute(name);continue;}
      if(name==="style"&&el===root&&/^\s*color\s*:\s*(?:#[0-9a-f]{3,8}|rgba?\([\d.,%\s]+\)|[a-z]+)\s*;?\s*$/i.test(value)){el.removeAttribute(name);continue;}
      if(!attrs.has(name)||(namespaceURI&&name!=="xmlns"))throw Error("지원하지 않는 SVG 속성: "+name);
      if(/url\s*\(/i.test(value)&&!/^url\(\s*#[\w:.-]+\s*\)$/i.test(value))throw Error("외부 참조 금지");
      if(/(?:javascript|data|https?):/i.test(value)&&name!=="xmlns")throw Error("외부 값 금지");
      if(/^currentColor$/i.test(value.trim())){el.setAttribute(name,"#ededed");themed=true;}
    }
  }
  let dims=root.getAttribute("viewBox")?.trim().split(/[\s,]+/).map(Number);
  if(!dims||dims.length!==4||!dims.every(Number.isFinite)||dims[2]<=0||dims[3]<=0){
    const w=Number(root.getAttribute("width")),h=Number(root.getAttribute("height"));
    if(!(w>0&&h>0&&Number.isFinite(w)&&Number.isFinite(h)))throw Error("SVG 크기 확인 불가");
    dims=[0,0,w,h];root.setAttribute("viewBox",dims.join(" "));
  }
  const [x,y,w,h]=dims;if(w>10000||h>10000)throw Error("SVG 크기 제한");
  root.setAttribute("width",String(w));root.setAttribute("height",String(h));
  if(themed){
    const bg=doc.createElementNS(ns,"rect");
    for(const [k,v] of Object.entries({x,y,width:w,height:h,fill:"#1c1c1c",rx:4}))bg.setAttribute(k,String(v));
    root.insertBefore(bg,root.firstChild);
  }
  return new XMLSerializer().serializeToString(root)+"\n";
}

async function convertText(text,candidates,save,normalize){
  let output=text,converted=0,failed=0;const replacements=[];
  for(const item of candidates.slice(0,MAX_IMAGES)){
    try{const path=await save(normalize(decodeSvg(item.uri)));replacements.push({from:item.from,to:item.to,value:"![["+path+"|"+(item.alt?item.alt+"|":"")+item.width+"]]"});converted++;}catch(e){failed++;}
  }
  for(const r of replacements.reverse())output=output.slice(0,r.from)+r.value+output.slice(r.to);
  return {text:output,converted,failed:failed+Math.max(0,candidates.length-MAX_IMAGES)};
}

async function saveSvg(vault,svg,hash){
  let folder="";
  for(const part of DIR.split("/")){folder=folder?folder+"/"+part:part;if(!vault.getAbstractFileByPath(folder)){try{await vault.createFolder(folder);}catch(e){if(!vault.getAbstractFileByPath(folder))throw e;}}}
  const path=DIR+"/diagram-"+hash(svg)+".svg",existing=vault.getAbstractFileByPath(path);
  if(existing){if(await vault.read(existing)!==svg)throw Error("첨부 파일 충돌");return path;}
  try{await vault.create(path,svg);}catch(e){const f=vault.getAbstractFileByPath(path);if(!f||await vault.read(f)!==svg)throw e;}
  return path;
}

function pasteText(data,toMarkdown){
  const plain=data.getData("text/plain");if(plain.length>MAX_PASTE)return null;
  if(findImages(plain).length)return plain;
  const html=data.getData("text/html");if(html.length>MAX_PASTE||!html.toLowerCase().includes("data:image/svg+xml"))return null;
  const md=toMarkdown(html);return md.length<=MAX_PASTE&&findImages(md).length?md:null;
}

const {Plugin,Notice,MarkdownView,htmlToMarkdown}=require("obsidian");
const {createHash}=require("crypto");
const hash=svg=>createHash("sha256").update(svg,"utf8").digest("hex");
class AutoSvgAttachments extends Plugin {
  onload(){
    this.enabled=true;
    this.registerEvent(this.app.workspace.on("editor-paste",(event,editor,info)=>this.onPaste(event,editor,info)));
    this.addCommand({id:"convert-current-note",name:"현재 노트의 인라인 SVG를 첨부 파일로 변환",editorCallback:(editor,view)=>{
      const snapshot=editor.getValue(),candidates=findImages(snapshot);
      if(!candidates.length){new Notice("변환할 인라인 SVG가 없습니다.");return;}
      void this.convert(editor,view.file,snapshot,candidates);
    }});
  }
  onunload(){this.enabled=false;}
  onPaste(event,editor,info){
    if(event.defaultPrevented||!event.clipboardData||event.clipboardData.files.length||!info.file||editor.listSelections().length!==1)return;
    let pasted;try{pasted=pasteText(event.clipboardData,htmlToMarkdown);}catch(e){return;}
    if(!pasted)return;
    const before=editor.getValue(),from=editor.posToOffset(editor.getCursor("from")),to=editor.posToOffset(editor.getCursor("to"));
    const snapshot=before.slice(0,from)+pasted+before.slice(to);
    const candidates=findImages(snapshot).filter(x=>x.from>=from&&x.to<=from+pasted.length);
    if(!candidates.length)return;
    const file=info.file;event.preventDefault();
    // 원문 먼저 삽입. 저장 실패, 입력, 탭 이동 시 원문 보존.
    editor.replaceSelection(pasted);
    if(editor.getValue()!==snapshot){new Notice("SVG 원문을 보존했습니다. 필요하면 변환 명령을 실행하세요.");return;}
    void this.convert(editor,file,snapshot,candidates);
  }
  async convert(editor,file,snapshot,candidates){
    try{
      const result=await convertText(snapshot,candidates,svg=>saveSvg(this.app.vault,svg,hash),normalizeSvg);
      const view=this.app.workspace.getActiveViewOfType(MarkdownView);
      if(!this.enabled||!view||view.file!==file||view.editor!==editor||editor.getValue()!==snapshot){
        if(this.enabled)new Notice("노트 변경 또는 탭 전환으로 SVG 원문을 보존했습니다. 변환 명령을 다시 실행할 수 있습니다.");
        return;
      }
      if(result.converted){
        let a=0,b=snapshot.length,c=result.text.length;
        while(a<b&&a<c&&snapshot[a]===result.text[a])a++;
        while(b>a&&c>a&&snapshot[b-1]===result.text[c-1]){b--;c--;}
        editor.replaceRange(result.text.slice(a,c),editor.offsetToPos(a),editor.offsetToPos(b));
      }
      new Notice("SVG 첨부 "+result.converted+"개"+(result.failed?", 원문 유지 "+result.failed+"개":""));
    }catch(e){if(this.enabled)new Notice("SVG 자동 변환 실패: 원문을 유지했습니다.");}
  }
}
module.exports=AutoSvgAttachments;
module.exports.findImages=findImages;
module.exports.decodeSvg=decodeSvg;
module.exports.convertText=convertText;
module.exports.saveSvg=saveSvg;
module.exports.pasteText=pasteText;
