import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { loadState, STORAGE_KEY, type PlannerState } from './model';

interface Context {state:PlannerState;update:(change:Partial<PlannerState>|((state:PlannerState)=>PlannerState))=>void;replace:(state:PlannerState)=>void;notify:(text:string)=>void;toast:string;storageError:string}
const PlannerContext=createContext<Context|null>(null);
export function PlannerProvider({children}:{children:ReactNode}){
  const [initial]=useState(loadState),[state,setState]=useState(initial.state),[toast,setToast]=useState(''),[storageError,setStorageError]=useState(initial.warning);
  const dirty=useRef(false);
  useEffect(()=>{if(!dirty.current)return;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));setStorageError('');}catch{setStorageError('浏览器暂时无法保存。请导出档案备份，避免刷新后丢失更改。');}},[state]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(timer);},[toast]);
  const update=(change:Partial<PlannerState>|((state:PlannerState)=>PlannerState))=>{dirty.current=true;setState(previous=>({...(typeof change==='function'?change(previous):{...previous,...change}),updatedAt:new Date().toISOString()}));};
  const replace=(next:PlannerState)=>{dirty.current=true;setState({...next,updatedAt:new Date().toISOString()});};
  return <PlannerContext.Provider value={{state,update,replace,notify:setToast,toast,storageError}}>{children}</PlannerContext.Provider>;
}
export function usePlanner(){const context=useContext(PlannerContext);if(!context)throw new Error('PlannerProvider missing');return context;}
