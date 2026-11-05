(async function migrateBatch(tools, config) {
"use strict";
// One-time SHA-pinned ChatGPT Code Mode function. No credentials or private Notion links are persisted.
const repo="guseoh/cs", branch="notion-import";
const start=config.start, count=config.count||8;
if(!Number.isInteger(start)||start<0||start>=345||count>8||count<1)throw Error("invalid batch");
let cursor,rows;
for(let page=0;page<=Math.floor(start/100);page++){
  const data={mode:"view",view_url:"view://1c89cdd8-e623-4956-a0e8-3e90351a1ca0",page_size:100,is_archived:false};
  if(cursor)data.start_cursor=cursor;
  const result=JSON.parse((await tools.mcp__Notion__query_data_sources({data})).text);
  rows=result.results;cursor=result.next_cursor;
}
const actual=Math.min(count,345-start);
const selected=rows.slice(start%100,start%100+actual);
if(selected.length!==actual)throw Error("Notion page boundary or row count changed");
const duplicatePairs=[[7,169,"2026-09-14"],[71,157,"2026-09-19"],
[130,296,"2026-08-13"],[131,272,"2026-07-26"],[132,234,"2026-08-22"],
[141,333,"2026-08-04"],[142,338,"2026-08-04"],[143,318,"2026-08-11"],
[150,323,"2026-08-08"],[153,267,"2026-07-28"],[154,261,"2026-07-29"],
[155,269,"2026-07-27"],[162,309,"2026-08-09"],[163,287,"2026-07-21"],
[165,334,"2026-08-04"],[167,325,"2026-08-08"],[170,277,"2026-07-24"],[171,196,"2026-09-05"]];
const older=new Map(duplicatePairs.map(p=>[p[0],p[2]])),skip=new Set(duplicatePairs.map(p=>p[1]));
const existing=new Set(["oliveyoung.tech/2026-09-14/global-store-new-way-of-working","oliveyoung.tech/2026-03-06/delivery-optimization"]);
const tag={
"DB·데이터":"tech/DB-데이터","성능":"tech/성능","설계·아키텍처":"tech/설계-아키텍처",
"테스트":"tech/테스트","장애·운영":"tech/장애-운영","리팩터링":"tech/리팩터링",
"동시성·분산":"tech/동시성-분산","인프라·DevOps":"tech/인프라-DevOps",
"AI·개발도구":"tech/AI-개발도구","보안":"tech/보안","개발문화·회고":"tech/개발문화-회고"};
const norm=u=>{const raw=String(u).replace(/^https?:\/\/(?:www\.)?/i,"").replace(/\/+$/,"").toLowerCase();try{return decodeURI(raw)}catch{return raw}};
const quoted=x=>JSON.stringify(String(x));
const hash=x=>{let h=2166136261;for(let i=0;i<x.length;i++){h^=x.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,"0")};
const clean=x=>String(x||"").replace(/<br\s*\/?>/gi,"\n")
 .replace(/<code>([\s\S]*?)<\/code>/gi,(_,m)=>String.fromCharCode(96)+m+String.fromCharCode(96))
 .replace(/<(?:b|strong)>([\s\S]*?)<\/(?:b|strong)>/gi,"**$1**")
 .replace(/<(?:i|em)>([\s\S]*?)<\/(?:i|em)>/gi,"*$1*")
 .replace(/<\/?(?:p|div|span)(?:\s[^>]*)?>/gi,"")
 .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'")
 .replace(/\\~/g,"~").replace(/\n{3,}/g,"\n\n").trim();
function section(body,name){
 const lines=body.split("\n"),begin=lines.findIndex(x=>x.trim()==="## "+name);
 if(begin<0)return "";
 let end=begin+1;while(end<lines.length&&!/^##\s/.test(lines[end]))end++;
 return clean(lines.slice(begin+1,end).join("\n"));
}
function convert(row,index,page){
 const match=page.match(/<content>\r?\n([\s\S]*?)\r?\n<\/content>/);
 if(!match)throw Error("missing Notion content");
 const body=match[1],url=row["원문 URL"],title=row["제목"],date=row["date:날짜:start"];
 if(!title||!/^https?:\/\//i.test(url)||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error("invalid properties");
 const categories=JSON.parse(row["유형"]||"[]");
 if(!categories.length||categories.length>2||categories.some(x=>!tag[x]))throw Error("missing/invalid categories");
 const brief=body.match(/<callout\b[^>]*>([\s\S]*?)<\/callout>/i);
 const legacy=body.match(/^>\s*<b>한 줄 정리:<\/b>\s*(.+)$/m);
 if(!brief&&!legacy)throw Error("missing summary in callout and legacy quote");
 const summary=clean(brief
   ? brief[1].replace(/^[\s\S]*?한 줄 정리<\/b>\s*/i,"")
   : legacy[1]).replace(/\s+/g," ").trim();
 if(summary.length<18)throw Error("summary too short");
 const core=section(body,"핵심 내용"),why=section(body,"왜 읽을까"),sourceSection=section(body,"원문");
 if(core.length<70||why.length<35)throw Error("detail section incomplete: "+core.length+"/"+why.length);
 const urls=[...sourceSection.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map(x=>x[1]);
 if(!urls.some(u=>norm(u)===norm(url)))throw Error("source citation not identical");
 const header=body.match(/^>\s*<b>(.*?)<\/b>\s*·\s*([^\n]+)$/m);
 const source=header?clean(header[1]).replace(/\*/g,""):norm(url).split("/")[0];
 const pub=header&&header[2].match(/(\d{4})\D+?(\d{1,2})\D+?(\d{1,2})/);
 const published=pub?pub[1]+"-"+pub[2].padStart(2,"0")+"-"+pub[3].padStart(2,"0"):"";
 const projectHeader=body.match(/^##\s*(프로젝트에 적용\s*[—–-]\s*(.+))$/m);
 const legacyProject=body.match(/^##\s*(프로젝트 적용)\s*$/m);
 const pname=projectHeader?projectHeader[2].trim():"";
 const projectBody=projectHeader?section(body,projectHeader[1])
   : legacyProject?section(body,legacyProject[1]):"";
 const namedProjects=(legacyProject?projectBody.split("\n")[0]:pname).match(/PawCycle|DevPedia|FutMatch/g)||[];
 const projects=[...new Set(namedProjects)];
 if((projectHeader||legacyProject)&&projectBody.length<25)throw Error("missing project details");
 const slug=String(title).normalize("NFKC").replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"").slice(0,52).replace(/-$/,"")||"article";
 const path="References/Tech Articles/Articles/"+date.slice(0,4)+"/"+date+"-"+slug+"-"+hash(norm(url))+".md";
 const list=(name,items)=>[name+":"].concat(items.map(x=>"  - "+quoted(x)));
 const content=[
 "---","type: tech-article","title: "+quoted(title),"aliases: []",
 "summary: "+quoted(summary),"source: "+quoted(source),
 "published: "+published,"collected: "+date,
 ...(older.has(index)?["collected_dates:","  - "+date,"  - "+older.get(index)]:[]),
 "url: "+quoted(url),"topic: "+quoted(categories[0]),
 ...list("categories",categories),
 ...(projects.length?list("projects",projects):["projects: []"]),
 "status: inbox",...list("tags",["tech-article",...categories.map(x=>tag[x])]),
 "migration_origin: notion","---","",
 "# "+title.replace(/[\r\n]/g," "),"",
 "> [!abstract] 한 줄 정리","> "+summary,"",
 "> "+source+(published?" · "+published:""),"",
 "## 핵심 내용","",core,"",
 "## 왜 읽을까","",why,"",
 ...(projectBody?["**프로젝트에 적용"+(pname?" — "+pname:"")+"**","",projectBody,""]:[]),
 "---","","**원문:** ["+title.replace(/[[\]]/g,"\\$&")+"]("+url+")",""
 ].join("\n");
 if(content.length<500)throw Error("unexpected short generated article");
 return {path,content,published:!!published,duplicate:older.has(index),project:projects,originalLength:body.length,convertedLength:content.length};
}
const allowed=selected.map((row,i)=>({row,index:start+i}))
 .filter(x=>!skip.has(x.index)&&!existing.has(norm(x.row["원문 URL"])));
const converted=[],flags=[];let next=0;
async function worker(){while(next<allowed.length){const item=allowed[next++];try{
 const result=await tools.mcp__Notion__fetch({id:item.row.url});
 const raw=result.structuredContent?.text;
 if(typeof raw!=="string")throw Error("missing Notion text");
 converted.push(convert(item.row,item.index,raw));
 }catch(e){flags.push({index:item.index,title:item.row["제목"],reason:String(e)})}
}}
await Promise.all(Array.from({length:Math.min(4,allowed.length)},worker));
converted.sort((a,b)=>a.path.localeCompare(b.path));
const audit={rows:start+"-"+(start+actual-1),selected:actual,reviewed:converted.length,
 duplicateRowsSkipped:selected.map((_,i)=>start+i).filter(i=>skip.has(i)).length,
 existingSkipped:selected.filter(r=>existing.has(norm(r["원문 URL"]))).length,
 repeatedDatesPreserved:converted.filter(x=>x.duplicate).length,
 missingPublished:converted.filter(x=>!x.published).length,
 projects:[...new Set(converted.flatMap(x=>x.project))],
 sample:converted.slice(0,2).map(x=>({path:x.path,size:x.convertedLength})),flags};
if(flags.length)return {...audit,committed:false,reason:"manual review required"};
if(!converted.length)return {...audit,committed:false,reason:"duplicate or already migrated"};
const ref=await tools.mcp__GitHub__fetch({url:"https://api.github.com/repos/"+repo+"/git/ref/heads/"+branch});
const sha=JSON.parse(ref.result.content).object.sha;
const commit=await tools.mcp__GitHub__fetch({url:"https://api.github.com/repos/"+repo+"/git/commits/"+sha});
const baseTree=JSON.parse(commit.result.content).tree.sha;
const tree=await tools.mcp__GitHub__create_tree({repository_full_name:repo,base_tree_sha:baseTree,
 tree_elements:converted.map(x=>({path:x.path,type:"blob",mode:"100644",content:x.content}))});
const nextCommit=await tools.mcp__GitHub__create_commit({repository_full_name:repo,tree_sha:tree.result.sha,parent_sha:sha,
 message:"migrate(daily-tech): reviewed Notion entries "+start+"-"+(start+actual-1)});
const re=await tools.mcp__GitHub__fetch({url:"https://api.github.com/repos/"+repo+"/git/ref/heads/"+branch});
if(JSON.parse(re.result.content).object.sha!==sha)throw Error("branch changed, no overwrite");
const changed=await tools.mcp__GitHub__update_ref({repository_full_name:repo,branch_name:branch,sha:nextCommit.result.sha,expected_sha:sha,force:false});
return {...audit,committed:changed.result.success,sha:nextCommit.result.sha};
})