'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {SPORT_NAMES} from '@/lib/constants';
import {searchMatches} from '@/lib/fixtures';
import FixtureFilters from './FixtureFilters';
import Icon from './Icon';
import LeagueMark from './LeagueMark';

export default function SportsSearch({selection,leagues,options,action='/student/fixtures',mode='fixtures',compact=false,autoFocus=false,loading=false,onSearch}){
 const router=useRouter(),id=useId(),dialog=useRef(null);
 const [value,setValue]=useState(selection.q||''),[focused,setFocused]=useState(false),[active,setActive]=useState(-1),[advanced,setAdvanced]=useState(false);
 const unchanged=value===(selection.q||'');
 const suggestions=value.trim()?options.filter(o=>(!selection.sport||o.sport===selection.sport)&&searchMatches(o.name,value)).slice(0,8):[];
 const expanded=focused&&!!value.trim();
 useEffect(()=>{
  if(!advanced)return;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=previous;};
 },[advanced]);
 function navigate(option){
  const params=new URLSearchParams();
  for(const key of ['sport','type','status'])if(selection[key]&&mode!=='tables')params.set(key,selection[key]);
  if(mode==='tables'&&selection.sport)params.set('sport',selection.sport);
  if(value.trim())params.set('q',value.trim());
  if(unchanged&&!option)for(const key of ['league','team','team_name'])if(selection[key])params.set(key,selection[key]);
  if(option){params.set('q',option.name);for(const key of ['league','team','team_name'])if(option[key])params.set(key,option[key]);setValue(option.name);}
  setFocused(false);setActive(-1);onSearch?.();router.push(params.size?`${action}?${params}`:action);
 }
 function keyboard(e){
  if(e.key==='Escape'){e.preventDefault();setFocused(false);setActive(-1);return;}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
   e.preventDefault();setFocused(true);if(suggestions.length)setActive(i=>e.key==='ArrowDown'?(i+1)%suggestions.length:(i<=0?suggestions.length:i)-1);
  }else if(e.key==='Enter'&&expanded&&active>=0&&suggestions[active]){e.preventDefault();navigate(suggestions[active]);}
 }
 const context={q:value.trim(),...(unchanged?{team:selection.team,team_name:selection.team_name}:{})};
 return <section className="sports-search" aria-label={mode==='tables'?'Search league tables':'Search matches'}>
  <form role="search" aria-label={compact?'Header search':'Page search'} className="sports-search-form" onSubmit={e=>{e.preventDefault();navigate();}}>
   <div className="sports-search-field" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget)){setFocused(false);setActive(-1);}}}>
    <Icon name="search"/>
    <input type="search" role="combobox" aria-label="Search leagues or teams" aria-autocomplete="list" aria-expanded={expanded} aria-controls={expanded?`${id}-suggestions`:undefined} aria-activedescendant={expanded&&active>=0?`${id}-option-${active}`:undefined} autoComplete="off" autoFocus={autoFocus} maxLength={120} placeholder="Search leagues or teams" value={value} onChange={e=>{setValue(e.target.value);setActive(-1);setFocused(true);}} onFocus={()=>setFocused(true)} onKeyDown={keyboard}/>
    {expanded&&<div className="sports-suggestions" id={`${id}-suggestions`} role="listbox" aria-label="League and team suggestions">
     {suggestions.map((o,i)=><button type="button" role="option" id={`${id}-option-${i}`} aria-selected={active===i} key={o.key} onPointerDown={e=>e.preventDefault()} onClick={()=>navigate(o)}>{o.kind==='League'?<LeagueMark league={{name:o.name,logo_path:o.logo_path}}/>:<Icon name="users"/>}<span>{o.name}<small>{o.kind} · {SPORT_NAMES[o.sport]}</small></span><Icon name="chevron-right"/></button>)}
     {!suggestions.length&&<p className="help" {...(loading?{role:'status'}:{})}>{loading?'Loading suggestions…':'No matching leagues or teams.'}</p>}
    </div>}
   </div>
   <button className="button search-submit" type="submit"><Icon name="search"/><span>Search</span></button>
  </form>
  {!compact&&<><button className="advanced-search-trigger" type="button" aria-haspopup="dialog" aria-controls={`${id}-advanced`} onClick={()=>{setFocused(false);dialog.current.showModal();setAdvanced(true);}}><Icon name="filter"/>Advanced search</button>
  <dialog className="search-dialog" ref={dialog} id={`${id}-advanced`} aria-labelledby={`${id}-title`} onClose={()=>setAdvanced(false)} onClick={e=>{if(e.target===e.currentTarget)dialog.current.close();}}>
   <div className="search-dialog-content"><div className="section-header"><h2 id={`${id}-title`}>Advanced search</h2><button className="icon-button" aria-label="Close advanced search" type="button" onClick={()=>dialog.current.close()}><Icon name="close"/></button></div>
    {advanced&&<FixtureFilters selection={{...selection,league:unchanged?selection.league:'',leagues}} action={action} tableOnly={mode==='tables'} searchContext={context} {...(mode==='live'?{statuses:['','live','completed','walkover','cancelled']}:{})}/>}
   </div>
  </dialog></>}
 </section>;
}
