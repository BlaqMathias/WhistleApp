import Icon from './Icon';
import {sideTeam} from '@/lib/sports';
export default function FixtureEvents({fixture:f,teams}) {
 if(!['live','completed'].includes(f.status))return null;
 const details=f.player_details;
 const goals=f.sport==='football'?details?.goals||[]:[];
 const motm=details?.man_of_the_match;
 if(!goals.length&&!motm)return null;
 return <section className="fixture-events" aria-label="Match highlights">
  {goals.length>0&&<><h2>Goalscorers</h2><div className="goal-lines">{['home','away'].map(side=><div className={`goal-side ${side}`} key={side}>
   <h3>{sideTeam(f,teams,side).name}</h3>
   <ul>{goals.filter(g=>g.side===side).map((g,index)=><li key={index}><Icon name="football"/><span>{g.scorer?.name||'Scorer not recorded'}{g.assist&&<small>Assist: {g.assist.name}</small>}</span></li>)}</ul>
  </div>)}</div></>}
  {motm&&<p className="match-award"><Icon name="trophy"/><span><strong>Man of the Match</strong>{motm.name}<small>{sideTeam(f,teams,motm.side).name}</small></span></p>}
 </section>;
}
