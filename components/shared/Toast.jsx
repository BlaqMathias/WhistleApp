'use client';
import {useEffect,useState} from 'react';
import Icon from './Icon';
export function notify(message){window.dispatchEvent(new CustomEvent('whistle-toast',{detail:message}));}
export default function Toast(){
 const [toast,setToast]=useState(null);
 useEffect(()=>{let timer;const show=e=>{if(typeof e.detail!=='string')return;clearTimeout(timer);setToast({message:e.detail,id:Date.now()});timer=setTimeout(()=>setToast(null),3500);};window.addEventListener('whistle-toast',show);return()=>{clearTimeout(timer);window.removeEventListener('whistle-toast',show);};},[]);
 return <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">{toast&&<div className="toast-pill" key={toast.id}><Icon name="check"/>{toast.message}</div>}</div>;
}
