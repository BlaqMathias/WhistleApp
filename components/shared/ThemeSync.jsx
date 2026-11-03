'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

export default function ThemeSync() {
 const pathname=usePathname();
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  function sync(event){
   let choice='system';
   if(!/^\/(login|signup)(\/|$)/.test(pathname)){
    try{choice=localStorage.getItem('whistle-theme')||'system';}catch{}
    if(event?.type==='whistle-theme-change')choice=event.detail;
   }
   const root=document.documentElement;
   if(choice==='light'||choice==='dark')root.dataset.theme=choice;
   else root.removeAttribute('data-theme');
   const colour=getComputedStyle(root).getPropertyValue('--bg').trim();
   document.querySelectorAll('meta[name="theme-color"]').forEach(meta=>{meta.content=colour;meta.removeAttribute('media');});
  }
  sync();media.addEventListener('change',sync);window.addEventListener('storage',sync);window.addEventListener('whistle-theme-change',sync);
  return()=>{media.removeEventListener('change',sync);window.removeEventListener('storage',sync);window.removeEventListener('whistle-theme-change',sync);};
 },[pathname]);
 return null;
}
