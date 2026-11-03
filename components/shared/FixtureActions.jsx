'use client';
import {useEffect,useId,useRef,useState} from 'react';
import Link from 'next/link';
import {matchHref} from '@/lib/account';
import Icon from './Icon';

export default function FixtureActions({fixture}) {
 const [open,setOpen]=useState(false),container=useRef(null),trigger=useRef(null),menu=useRef(null),id=useId();
 useEffect(()=>{
  if(!open)return;
  menu.current?.querySelector('a')?.focus();
  const outside=e=>{if(!container.current?.contains(e.target))setOpen(false);};
  const escape=e=>{if(e.key==='Escape'){e.preventDefault();setOpen(false);trigger.current?.focus();}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
 },[open]);
 function keyboard(e){
  if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
  e.preventDefault();
  const links=[...menu.current.querySelectorAll('a')],index=links.indexOf(document.activeElement);
  links[e.key==='Home'?0:e.key==='End'?links.length-1:(index+(e.key==='ArrowDown'?1:-1)+links.length)%links.length]?.focus();
 }
 return <div className="fixture-more" ref={container} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}}>
  <button ref={trigger} type="button" className="fixture-more-trigger" aria-label={`More options for ${fixture.home_name} vs ${fixture.away_name}`} aria-haspopup="menu" aria-expanded={open} aria-controls={open?id:undefined} onClick={()=>setOpen(value=>!value)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(true);}}}><Icon name="more"/></button>
  {open&&<nav ref={menu} id={id} className="fixture-more-popup" role="menu" aria-label="Fixture options" onKeyDown={keyboard}>
   <Link role="menuitem" href={matchHref(fixture.id)} onClick={()=>setOpen(false)}>Predictions</Link>
   <Link role="menuitem" href={matchHref(fixture.id,'squad')} onClick={()=>setOpen(false)}>Squad</Link>
  </nav>}
 </div>;
}
