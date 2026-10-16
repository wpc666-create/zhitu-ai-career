import { scoreRiasec, getTopCode } from '../app/engine/riasec';
import { computeSkillGap } from '../app/engine/skillGapCore';
import type { CareerPassport, Proficiency } from '../app/engine/types';
import { CAREERS, QUESTIONS, SKILLS, VALUES, TASK_TITLES, TASK_DETAILS, type Career } from './data';

export const STORAGE_KEY = 'zhitu-ai-career-v1';
export interface Profile { name:string; grade:string; major:string; hours:number; goal:string; skills:Record<string,number>; values:Record<string,number> }
export interface PlannerState {
  version:1; example:boolean; profile:Profile; responses:Record<string,number>;
  interestCompleted:boolean; skillsCompleted:boolean; valuesCompleted:boolean;
  target:string; completed:string[]; bookmarks:string[]; reflection:string; updatedAt:string;
}
export function createExample():PlannerState {
  return {version:1,example:true,profile:{name:'探索者',grade:'大二',major:'人工智能',hours:8,goal:'做出一个真正有人使用的 AI 应用，在实践中找到适合自己的方向。',
    skills:{python:2,math:2,data:2,ml:1,dl:1,engineering:1,sql:2,product:2,communication:3,research:2},
    values:{growth:5,impact:5,autonomy:4,stability:3,balance:4,compensation:3}},
    responses:Object.fromEntries(QUESTIONS.map(q=>[q.id,({r:3,i:5,a:4,s:4,e:3,c:4} as Record<string,number>)[q.id[0]]])),
    interestCompleted:true,skillsCompleted:true,valuesCompleted:false,target:'llm',
    completed:['llm-0','llm-1','llm-2'],bookmarks:['r6','r3'],reflection:'',updatedAt:new Date().toISOString()};
}
export function createBlank():PlannerState {
  const state=createExample();
  return {...state,example:false,profile:{...state.profile,name:'同学',goal:'',skills:Object.fromEntries(SKILLS.map(s=>[s.id,0])),values:Object.fromEntries(VALUES.map(v=>[v.id,3]))},responses:{},interestCompleted:false,skillsCompleted:false,valuesCompleted:false,completed:[],bookmarks:[]};
}
const record=(value:unknown):value is Record<string,unknown>=>typeof value==='object' && value!==null && !Array.isArray(value);
const text=(value:unknown,max:number,fallback='')=>typeof value==='string'?value.slice(0,max):fallback;
const number=(value:unknown,min:number,max:number,fallback:number)=>typeof value==='number'&&Number.isFinite(value)?Math.max(min,Math.min(max,Math.round(value))):fallback;
export function validateState(raw:unknown):PlannerState {
  if(!record(raw)||raw.version!==1||!record(raw.profile))throw new Error('请选择智途 AI 导出的有效档案文件。');
  const base=createBlank(),p=raw.profile;
  const skills=record(p.skills)?p.skills:{},values=record(p.values)?p.values:{},responses=record(raw.responses)?raw.responses:{};
  const answered=Object.fromEntries(QUESTIONS.filter(q=>typeof responses[q.id]==='number' && Number.isInteger(responses[q.id]) && Number(responses[q.id])>=1 && Number(responses[q.id])<=5).map(q=>[q.id,Number(responses[q.id])]));
  const ids=new Set(CAREERS.flatMap(c=>TASK_TITLES.map((_,i)=>`${c.id}-${i}`)));
  return {...base,example:raw.example===true,profile:{name:text(p.name,30,'同学'),grade:['大一','大二','大三','大四','研究生','其他'].includes(String(p.grade))?String(p.grade):'大二',major:text(p.major,40,'人工智能'),hours:number(p.hours,2,30,8),goal:text(p.goal,400),skills:Object.fromEntries(SKILLS.map(s=>[s.id,number(skills[s.id],0,4,0)])),values:Object.fromEntries(VALUES.map(v=>[v.id,number(values[v.id],1,5,3)]))},
    responses:answered,interestCompleted:raw.interestCompleted===true&&Object.keys(answered).length===QUESTIONS.length,
    skillsCompleted:raw.skillsCompleted===true&&SKILLS.every(s=>Number.isInteger(skills[s.id])&&Number(skills[s.id])>=0&&Number(skills[s.id])<=4),
    valuesCompleted:raw.valuesCompleted===true&&VALUES.every(v=>Number.isInteger(values[v.id])&&Number(values[v.id])>=1&&Number(values[v.id])<=5),
    target:CAREERS.some(c=>c.id===raw.target)?String(raw.target):'llm',
    completed:Array.isArray(raw.completed)?[...new Set(raw.completed.filter((v):v is string=>typeof v==='string'&&ids.has(v)))]:[],
    bookmarks:Array.isArray(raw.bookmarks)?[...new Set(raw.bookmarks.filter((v):v is string=>typeof v==='string'&&/^r([1-9]|1[0-2])$/.test(v)))]:[],
    reflection:text(raw.reflection,4000),updatedAt:text(raw.updatedAt,40,new Date().toISOString())};
}
export function loadState():{state:PlannerState;warning:string} {
  try{const raw=localStorage.getItem(STORAGE_KEY);return {state:raw?validateState(JSON.parse(raw)):createExample(),warning:''};}
  catch{return {state:createExample(),warning:'无法读取本地档案，已临时载入示例。你可以导入备份或继续编辑。'};}
}
export function passportFor(state:PlannerState):CareerPassport {
  return {segment:'college_student',education:{level:'undergraduate',field:state.profile.major},experiences:[],
    skills:state.skillsCompleted?SKILLS.map(s=>({skillId:s.id,proficiency:(state.profile.skills[s.id]??0) as Proficiency,confidence:state.profile.skills[s.id]>0?.65:0,evidence:[{type:'self_reported',description:'学习者能力自评',confidence:state.profile.skills[s.id]>0?.65:0,observedAt:state.updatedAt}]})):[],
    ...(state.interestCompleted?{riasec:scoreRiasec(state.responses)}:{}),
    constraints:{location:'中国',canRelocate:true,weeklyLearningHours:state.profile.hours,budgetLevel:'low',languages:['zh-CN'],needsIncomeContinuity:false},completeness:Math.round([state.interestCompleted,state.skillsCompleted,state.valuesCompleted].filter(Boolean).length/3*100),version:1,updatedAt:state.updatedAt};
}
export function analyzeCareer(state:PlannerState,career:Career){
  const passport=passportFor(state),gap=computeSkillGap(passport,career);
  const scores=passport.riasec;
  // Absolute profile distance retains differences even when all answers are the same.
  const interest=scores?Math.round(100-Object.keys(career.interests).reduce((sum,key)=>sum+Math.abs(scores[key as keyof typeof scores]-career.interests[key as keyof typeof scores]),0)/6):null;
  const values=state.valuesCompleted?Math.round(career.values.reduce((sum,id)=>sum+(state.profile.values[id]-1)*25,0)/career.values.length):null;
  const components=[{value:interest,weight:.5},{value:state.skillsCompleted?gap.readiness:null,weight:.35},{value:values,weight:.15}].filter(v=>v.value!==null);
  const fit=components.length?Math.round(components.reduce((sum,item)=>sum+item.value!*item.weight,0)/components.reduce((sum,item)=>sum+item.weight,0)):null;
  return {career,fit,interest,values,gap,code:scores?getTopCode(scores):'—',confidence:components.length===3?'画像较完整':'继续完善画像'};
}
export function ranking(state:PlannerState){return CAREERS.map(c=>analyzeCareer(state,c)).sort((a,b)=>(b.fit??-1)-(a.fit??-1));}
export function planTasks(state:PlannerState,career:Career){
  return TASK_TITLES.map((title,index)=>({id:`${career.id}-${index}`,index,title,detail:index===5?`为「${career.project}」实现最简单的可运行版本。`:index===11?`完成${career.deliverable}，记录收获与下一步。`:TASK_DETAILS[index],stage:Math.floor(index/3),week:Math.ceil((index+1)*8/state.profile.hours),done:state.completed.includes(`${career.id}-${index}`)}));
}
export function progress(state:PlannerState,career:Career){const tasks=planTasks(state,career),done=tasks.filter(t=>t.done).length;return {done,total:tasks.length,percent:Math.round(done/tasks.length*100),next:tasks.find(t=>!t.done),weeks:Math.ceil(96/state.profile.hours)};}
export function downloadFile(name:string,data:string,type:string){const blob=new Blob([data],{type}),url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
