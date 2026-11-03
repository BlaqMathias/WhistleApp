'use client';
import {useRef} from 'react';
import {useSearchParams} from 'next/navigation';
import PollWidget from '@/components/student/PollWidget';
import TeamMark from './TeamMark';
import {sideTeam} from '@/lib/sports';
import {matchHref} from '@/lib/account';

export default function FixtureTabs({fixture,teams,squads,poll,account,initialTab}) {
 const query=useSearchParams(),tab=query.get('tab')==='squad'?'squad':'predictions',buttons=useRef({});
 const select=(value)=>{window.history.replaceState(null,'',matchHref(fixture.id,value));};
 const tabs=['predictions','squad'];
 function keyboard(e){
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();
  const value=e.key==='Home'?'predictions':e.key==='End'?'squad':tabs[(tabs.indexOf(tab)+1)%2];
  select(value);buttons.current[value]?.focus();
 }
 return <section className="fixture-tab-section">
  <div className="fixture-tabs" role="tablist" aria-label="Match information" onKeyDown={keyboard}>
   {tabs.map(value=><button key={value} ref={el=>{buttons.current[value]=el;}} id={`tab-${value}`} role="tab" type="button" aria-selected={tab===value} aria-controls={`panel-${value}`} tabIndex={tab===value?0:-1} onClick={()=>select(value)}>{value==='squad'?'Squad':'Predictions'}</button>)}
  </div>
  <div id="panel-predictions" className="fixture-tab-panel" role="tabpanel" aria-labelledby="tab-predictions" hidden={tab!=='predictions'}>
   <PollWidget fixture={fixture} teams={teams} poll={poll} publicView={!account} adminView={!!account?.is_admin}/>
  </div>
  <div id="panel-squad" className="fixture-tab-panel" role="tabpanel" aria-labelledby="tab-squad" hidden={tab!=='squad'}>
   <div className="squad-grid">{['home','away'].map(side=>{const team=sideTeam(fixture,teams,side);return <section key={side}>
    <h3 className="squad-heading"><TeamMark name={team.name} initials={team.initials} path={team.logo}/><span>{team.name}</span></h3>
    {squads[side]?.length?<ul className="squad-list">{squads[side].map((player,index)=><li key={index}>{player.name}</li>)}</ul>:<p className="help">Squad not available</p>}
   </section>;})}</div>
  </div>
 </section>;
}
