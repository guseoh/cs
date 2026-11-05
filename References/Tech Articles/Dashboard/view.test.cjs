"use strict";
// Dependency-free interaction checks for Obsidian's DataviewJS dashboard.
// Run: node "References/Tech Articles/Dashboard/view.test.cjs"
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

class Node {
  constructor(tag) { this.tagName=tag; this.children=[]; this.className=""; this._events={}; this.attributes={}; this.textContent=""; this.value=""; }
  appendChild(node) { this.children.push(node); return node; }
  replaceChildren(...nodes) { this.children=[...nodes]; }
  addEventListener(name,callback) { this._events[name]=callback; }
  setAttribute(key,value) { this.attributes[key]=value; }
  click() { assert.ok(this._events.click, "click handler exists"); this._events.click(); }
}
const document={createElement:tag=>new Node(tag)};
const container=new Node("container");
const notes=[
  {type:"tech-article",file:{path:"References/Tech Articles/Articles/2026/a.md",name:"a"},title:"Architecture",summary:"Order flow",topic:"설계·아키텍처",categories:["설계·아키텍처","동시성·분산"],projects:["PawCycle"],collected:"2026-11-05",source:"A",status:"inbox"},
  {type:"tech-article",file:{path:"References/Tech Articles/Articles/2026/b.md",name:"b"},title:"Retrospective",summary:"Team lessons",topic:"개발문화·회고",categories:["개발문화·회고"],projects:[],collected:"2026-11-04",source:"B",status:"reading"},
  {type:"tech-article",file:{path:"References/Tech Articles/Articles/2026/c.md",name:"c"},title:"Testing",summary:"Integration test",topic:"테스트",categories:["테스트"],projects:["DevPedia"],collected:"2026-10-03",source:"C",status:"reviewed"},
];
const dv={container,pages:()=>({where:fn=>({array:()=>notes.filter(fn)})})};
const opened=[];
const newTabLeaves=[];
const vaultLookups=[];
const app={
  vault:{
    getAbstractFileByPath:(filePath)=>{
      vaultLookups.push(filePath);
      return notes.some(note=>note.file.path===filePath)
        ? {path:filePath, extension:"md"} : null;
    }
  },
  workspace:{
    getLeaf:(kind)=>{
      assert.equal(kind,"tab","explicitly open in a new Obsidian tab");
      const leaf={
        async openFile(file) { opened.push(file.path); }
      };
      newTabLeaves.push(leaf);
      return leaf;
    }
  }
};
const source=fs.readFileSync(path.join(__dirname,"view.js"),"utf8");
vm.runInNewContext(source,{document,dv,app,console});
const find=(root,predicate)=>{let results=[]; if(predicate(root))results.push(root); for(const c of root.children)results.push(...find(c,predicate));return results;};
const dashboard=container.children[0];
const articleRows=()=>find(dashboard,n=>n.className==="tech-archive__article");
const topicChips=find(dashboard,n=>n.className.startsWith("tech-archive__chip") && !n.className.includes("tech-archive__project-chip"));
const projectChips=find(dashboard,n=>n.className.includes("tech-archive__project-chip"));
const topic=(label)=>topicChips.find(n=>n.textContent===label);
const project=(label)=>projectChips.find(n=>n.textContent===label);
assert.equal(topicChips.length,12,"Notion's 11 subjects plus All");
assert.ok(topic("AI·개발도구"),"even an unused Notion topic remains visible");
assert.ok(topic("인프라·DevOps"));
assert.ok(project("PawCycle"));
assert.ok(project("DevPedia"));
assert.equal(articleRows().length,3);
assert.equal(topic("전체").attributes["data-topic"],undefined,"all topics stays neutral");
assert.equal(topic("AI·개발도구").attributes["data-topic"],"AI·개발도구");
assert.equal(project("PawCycle").attributes["data-project"],"PawCycle");
assert.equal(find(dashboard,n=>n.className==="tech-archive__article-topic")[0].attributes["data-topic"],"설계·아키텍처");
assert.ok(find(dashboard,n=>n.className==="tech-archive__category").some(n=>n.attributes["data-topic"]==="동시성·분산"));
assert.ok(find(dashboard,n=>n.className==="tech-archive__project-tag").some(n=>n.attributes["data-project"]==="DevPedia"));
const calendar=find(dashboard,n=>n.className==="tech-archive__calendar-host")[0];
project("PawCycle").click();
assert.equal(articleRows().length,1,"PawCycle filters project membership");
assert.equal(project("PawCycle").attributes["aria-pressed"],"true");
assert.equal(container.children[0],dashboard,"project click never recreates the root");
assert.equal(find(dashboard,n=>n.className==="tech-archive__calendar-host")[0],calendar,"calendar survives project selection");
topic("동시성·분산").click();
assert.equal(articleRows().length,1,"Notion secondary category and PawCycle intersect");
topic("테스트").click();
assert.equal(articleRows().length,0,"mismatched topic/project combination");
topic("전체").click();
assert.equal(articleRows().length,1,"clear topic while retaining PawCycle");
project("전체").click();
assert.equal(articleRows().length,3,"clear project independently");
topic("보안").click();
assert.equal(articleRows().length,0,"empty Notion categories display valid empty results");
topic("전체").click();
assert.equal(articleRows().length,3);
const projectMark=find(dashboard,n=>n.className==="tech-archive__project-tag").map(n=>n.textContent);
assert.ok(projectMark.includes("PawCycle"),"article shows project metadata");
const search=find(dashboard,n=>n.className==="tech-archive__search")[0];
search.value="DevPedia";search._events.input();
assert.equal(articleRows().length,1,"project names are searchable");
assert.equal(container.children[0],dashboard,"search preserves the scroll anchor");
// A click must open the selected Markdown in an independent tab.
search.value=""; search._events.input();
assert.equal(articleRows().length,3);
const first = find(articleRows()[0],n=>n.className==="tech-archive__article-link")[0];
first.click();
assert.equal(newTabLeaves.length,1,"one newly created tab");
assert.equal(opened[0],notes[0].file.path,"the clicked article opens in the new tab");
assert.equal(container.children[0],dashboard,"dashboard remains mounted in its own tab");
const context={document,dv,app,console};
vm.runInNewContext(source, context);
const beforeMissingTab=newTabLeaves.length;
void context.openNote({path:"References/Tech Articles/Articles/2026/missing.md"});
assert.equal(newTabLeaves.length,beforeMissingTab,"missing note does not create an empty tab");

console.log("OK: 11 topic color markers, project markers, filters, scroll stability, new tabs, missing-file safety");
