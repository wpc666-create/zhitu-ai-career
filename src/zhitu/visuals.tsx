import { useId } from 'react';
import type { RiasecScores } from '../app/engine/types';
import { DIMENSIONS } from './data';

export function Brand({small=false}:{small?:boolean}){return <span className={`brand-symbol ${small?'small':''}`} aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M10 28 20 8l10 20M14 21h12M9 31h22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="30" cy="10" r="3" fill="currentColor"/></svg></span>;}
export function CareerOrb(){
  const id=useId().replace(/:/g,'');
  const nodes=Array.from({length:36},(_,i)=>{const a=i*2.399963,r=30+Math.sqrt(i/36)*108;return {x:240+Math.cos(a)*r,y:175+Math.sin(a)*r*.82};});
  return <div className="orb-scene" aria-hidden="true"><svg viewBox="0 0 480 350" className="career-orb">
    <defs><radialGradient id={`glow-${id}`}><stop stopColor="#5af1cd" stopOpacity=".23"/><stop offset="1" stopColor="#5af1cd" stopOpacity="0"/></radialGradient><linearGradient id={`orb-${id}`} x2="1" y2="1"><stop stopColor="#77e9d5"/><stop offset="1" stopColor="#3d73ad"/></linearGradient></defs>
    <circle cx="240" cy="175" r="173" fill={`url(#glow-${id})`}/>
    <g className="orb-orbits" fill="none" stroke="#5b9bba" strokeOpacity=".25"><ellipse cx="240" cy="175" rx="200" ry="83" transform="rotate(-28 240 175)"/><ellipse cx="240" cy="175" rx="180" ry="143" transform="rotate(32 240 175)" strokeDasharray="3 8"/><circle cx="240" cy="175" r="136"/></g>
    <g className="neural-core" stroke={`url(#orb-${id})`} fill="none">
      {[0,1,2,3,4].map(i=><ellipse key={`v${i}`} cx="240" cy="175" rx={24+i*24} ry="118" strokeOpacity=".2" transform={`rotate(${i*27} 240 175)`}/>)}
      {[-65,-32,0,32,65].map((y,i)=><ellipse key={`h${i}`} cx="240" cy={175+y} rx={Math.sqrt(118**2-y**2)} ry={25} strokeOpacity=".18"/>)}
      {nodes.map((n,i)=><g key={i}><path d={`M${n.x} ${n.y} L${nodes[(i+7)%nodes.length].x} ${nodes[(i+7)%nodes.length].y}`} strokeOpacity={i%3===0?'.36':'.12'}/><circle cx={n.x} cy={n.y} r={i%5===0?3.4:1.8} fill={i%5===0?'#9ef6df':'#60b5b3'} stroke="none" className={i%5===0?'neuron-pulse':''} style={{animationDelay:`${i*.17}s`}}/></g>)}
    </g>
    <circle cx="240" cy="175" r="39" fill="#102b3b" stroke="#63ddc3" strokeOpacity=".65"/>
    <text x="240" y="184" textAnchor="middle" fill="#bafbe8" fontSize="29" fontWeight="500" fontFamily="monospace" letterSpacing="4">AI</text>
    <g className="float-tag tag-one"><rect x="54" y="66" width="85" height="33" rx="9" fill="#1c3649" stroke="#416476"/><circle cx="70" cy="82" r="3" fill="#79dfca"/><text x="84" y="87" fill="#dcecf2" fontSize="11">机器学习</text></g>
    <g className="float-tag tag-two"><rect x="333" y="123" width="88" height="33" rx="9" fill="#1c3649" stroke="#416476"/><circle cx="349" cy="139" r="3" fill="#8fbcff"/><text x="363" y="144" fill="#dcecf2" fontSize="11">大模型应用</text></g>
    <g className="float-tag tag-three"><rect x="294" y="276" width="88" height="33" rx="9" fill="#1c3649" stroke="#416476"/><circle cx="310" cy="292" r="3" fill="#b4adfb"/><text x="324" y="297" fill="#dcecf2" fontSize="11">计算机视觉</text></g>
    <circle className="orb-traveler" cx="79" cy="246" r="4" fill="#86e7d3"/>
  </svg><div className="orb-caption"><span className="tiny-dot"/> CONNECT YOUR POSSIBILITIES</div></div>;
}
export function Radar({scores,compact=false}:{scores:RiasecScores;compact?:boolean}){
  const center=130,radius=80,point=(i:number,r:number)=>`${center+Math.sin(i*Math.PI/3)*r},${center-Math.cos(i*Math.PI/3)*r}`;
  return <svg className={`radar ${compact?'compact':''}`} viewBox="0 0 260 255" role="img" aria-label={DIMENSIONS.map(d=>`${d.name} ${scores[d.id]} 分`).join('，')}>
    {[.25,.5,.75,1].map(s=><polygon key={s} points={DIMENSIONS.map((_,i)=>point(i,radius*s)).join(' ')} fill={s===1?'#f7fafb':'none'} stroke="#e0e7ee"/>)}
    {DIMENSIONS.map((d,i)=><line key={d.id} x1={center} y1={center} x2={point(i,radius).split(',')[0]} y2={point(i,radius).split(',')[1]} stroke="#e0e7ee"/>)}
    <polygon className="radar-shape" points={DIMENSIONS.map((d,i)=>point(i,radius*scores[d.id]/100)).join(' ')} fill="#21a892" fillOpacity=".18" stroke="#159c89" strokeWidth="2"/>
    {DIMENSIONS.map((d,i)=>{const [x,y]=point(i,radius*scores[d.id]/100).split(',');const [tx,ty]=point(i,107).split(',');return <g key={d.id}><circle cx={x} cy={y} r="3" fill="#159c89" stroke="white" strokeWidth="1.5"/><text x={tx} y={Number(ty)+4} textAnchor="middle" fontSize="11" fill="#68758a">{d.name}</text></g>;})}
  </svg>;
}
export function ProgressRing({value,size=82}:{value:number;size?:number}){const radius=34,circumference=2*Math.PI*radius;return <svg width={size} height={size} viewBox="0 0 82 82" className="progress-ring" role="img" aria-label={`完成 ${value}%`}><circle cx="41" cy="41" r={radius} fill="none" stroke="#e5f2ee" strokeWidth="6"/><circle className="ring-value" cx="41" cy="41" r={radius} fill="none" stroke="#179c82" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference*(1-value/100)} transform="rotate(-90 41 41)"/><text x="41" y="46" textAnchor="middle" fill="#1e3348" fontSize="20" fontWeight="600">{value}<tspan fontSize="10">%</tspan></text></svg>;}
