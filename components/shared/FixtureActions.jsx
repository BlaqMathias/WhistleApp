'use client';
import {useEffect,useId,useLayoutEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {matchHref} from '@/lib/account';
import {send} from './FormState';
import Icon from './Icon';
import {notify} from './Toast';

export default function FixtureActions({fixture}){
 const [open,setOpen]=useState(false),[submenu,setSubmenu]=useState(false),[poll,setPoll]=useState(null),[canPredict,setCanPredict]=useState(false);
 const [loading,setLoading]=useState(false),[pending,setPending]=useState(false);
 const [position,setPosition]=useState({left:8,top:8,side:'left'});
 const trigger=useRef(null),layer=useRef(null),menu=useRef(null),prediction=useRef(null),choicesMenu=useRef(null),busy=useRef(false),id=useId(),router=useRouter();
 const choices=[['win_home','Home'],...(fixture.sport==='volleyball'?[]:[['draw','Draw']]),['win_away','Away']];
 const close=()=>{setOpen(false);setSubmenu(false);};
 async function readPoll(signal){
  const response=await fetch(`/api/polls/${fixture.id}`,{cache:'no-store',signal});
  const data=await response.json();if(!response.ok)throw new Error(data.error||'Predictions could not be loaded.');return data;
 }
 useEffect(()=>{
  if(!open)return;
  menu.current?.querySelector('[role="menuitem"]')?.focus();
  const outside=e=>{if(!layer.current?.contains(e.target)&&!trigger.current?.contains(e.target))close();};
  document.addEventListener('pointerdown',outside);document.addEventListener('focusin',outside);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('focusin',outside);};
 },[open]);
 useEffect(()=>{
  if(!open)return;
  const escape=e=>{if(e.key!=='Escape')return;e.preventDefault();if(submenu){setSubmenu(false);prediction.current?.focus();}else{close();trigger.current?.focus();}};
  document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape);
 },[open,submenu]);
 useEffect(()=>{
  if(!submenu)return;
  const controller=new AbortController();setLoading(true);setPoll(null);choicesMenu.current?.focus();
  readPoll(controller.signal).then(data=>{setPoll(data.poll);setCanPredict(data.can_predict);}).catch(e=>{if(!controller.signal.aborted)notify(e.message,'error');}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return()=>controller.abort();
 },[submenu,fixture.id,fixture.status]);
 useLayoutEffect(()=>{
  if(!open)return;
  function place(){
   const r=trigger.current.getBoundingClientRect(),width=window.innerWidth,height=window.innerHeight;
   const left=Math.max(8,Math.min(r.right-152,width-160)),tall=Math.max(menu.current?.offsetHeight||152,submenu?choicesMenu.current?.offsetHeight||190:0);
   const top=Math.max(8,Math.min(r.bottom+6,height-tall-8));
   setPosition({left,top,side:left>=154?'left':width-left-152>=146?'right':'below'});
  }
  place();window.addEventListener('resize',place);window.addEventListener('scroll',place,true);
  return()=>{window.removeEventListener('resize',place);window.removeEventListener('scroll',place,true);};
 },[open,submenu,loading,poll]);
 function keyboard(e,ref){
  if(e.key==='ArrowLeft'&&ref===choicesMenu){e.preventDefault();setSubmenu(false);prediction.current?.focus();return;}
  if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
  e.preventDefault();const items=[...ref.current.querySelectorAll('[role^="menuitem"]:not(:disabled)')],index=items.indexOf(document.activeElement);
  items[e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();
 }
 async function vote(choice){
  if(busy.current||!canPredict||!poll?.can_vote||fixture.status!=='scheduled')return;
  busy.current=true;setPending(true);
  try{await send(`/api/polls/${fixture.id}/vote`,{choice});close();trigger.current?.focus();notify('Prediction set');router.refresh();}
  catch(e){notify(e.message,'error');try{const data=await readPoll();setPoll(data.poll);setCanPredict(data.can_predict);}catch{setPoll(null);}}
  finally{busy.current=false;setPending(false);}
 }
 return <div className="fixture-more">
  <button ref={trigger} type="button" className="fixture-more-trigger" aria-label={`More options for ${fixture.home_name} vs ${fixture.away_name}`} aria-haspopup="menu" aria-expanded={open} aria-controls={open?id:undefined} onClick={()=>{if(open)close();else setOpen(true);}} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(true);}}}><Icon name="more"/></button>
  {open&&createPortal(<div className="fixture-menu-layer" ref={layer} style={{left:position.left,top:position.top}}>
   <nav ref={menu} id={id} className="fixture-more-popup" role="menu" aria-label="Fixture options" onKeyDown={e=>keyboard(e,menu)}>
    <button ref={prediction} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={submenu} aria-controls={submenu?`${id}-prediction`:undefined} onClick={()=>setSubmenu(v=>!v)} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();setSubmenu(true);}}}><Icon name="prediction"/>Predictions<Icon name="chevron-right"/></button>
    <Link role="menuitem" href={matchHref(fixture.id,'squad')} onClick={close}><Icon name="users"/>Squad</Link>
    <Link role="menuitem" href={matchHref(fixture.id,'squad')} onClick={close}><Icon name="more"/>More</Link>
   </nav>
   {submenu&&<nav ref={choicesMenu} id={`${id}-prediction`} className={`fixture-more-popup prediction-submenu submenu-${position.side}`} role="menu" aria-label="Prediction options" tabIndex={-1} onKeyDown={e=>keyboard(e,choicesMenu)}>
    {loading&&<p className="help" role="status">Loading…</p>}
    {choices.map(([choice,label])=><button type="button" role="menuitemradio" aria-checked={poll?.my_choice===choice} aria-label={label} key={choice} disabled={loading||pending||!canPredict||!poll?.can_vote||fixture.status!=='scheduled'} onClick={()=>vote(choice)}>{label}{poll?.my_choice===choice&&<Icon name="check"/>}</button>)}
    {!loading&&poll&&(!canPredict||!poll.can_vote||fixture.status!=='scheduled')&&<p className="help">{!canPredict?'Students only.':poll.status==='void'?'Predictions void.':'Voting closed.'}</p>}
   </nav>}
  </div>,document.body)}
 </div>;
}
