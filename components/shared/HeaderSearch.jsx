'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import Icon from './Icon';
import SportsSearch from './SportsSearch';
const selection={q:'',sport:'',type:'',status:'',league:'',team:'',team_name:''};
export function HeaderSearchToggle({open,onClick,id}){
 return <button type="button" className="icon-button" aria-label={open?'Close search':'Open search'} aria-expanded={open} aria-controls={id} onClick={onClick}><Icon name={open?'close':'search'}/></button>;
}
export function HeaderSearchPanel({id,onNavigate}){
 const path=usePathname(),mode=path==='/student/standings'?'tables':path==='/student/live'?'live':'fixtures';
 const [data,setData]=useState({options:[],leagues:[]}),[loading,setLoading]=useState(true),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  const controller=new AbortController();setLoading(true);setError(false);
  fetch(`/api/search?scope=${mode}`,{cache:'no-store',signal:controller.signal}).then(async response=>{if(!response.ok)throw new Error('Search unavailable');setData(await response.json());}).catch(e=>{if(e.name!=='AbortError')setError(true);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return()=>controller.abort();
 },[mode,attempt]);
 return <div id={id} className="header-search-panel" role="region" aria-label="Header search">
  <SportsSearch selection={selection} leagues={data.leagues} options={data.options} action={mode==='tables'?'/student/standings':mode==='live'?'/student/live':'/student/fixtures'} mode={mode} compact autoFocus loading={loading} onSearch={onNavigate}/>
  {error&&<div className="header-search-error"><span role="alert">Suggestions unavailable. You can still search.</span><button type="button" className="quiet-link" onClick={()=>setAttempt(n=>n+1)}>Retry</button></div>}
 </div>;
}
