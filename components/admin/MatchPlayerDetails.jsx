'use client';
import Button from '@/components/shared/Button';
import {sideTeam} from '@/lib/sports';

function PlayerChoice({label,side,value,onChange,fixture,students,roster}) {
 const teamId=fixture[`${side}_team_id`];
 const ids=roster.filter(r=>r.team_id===teamId).map(r=>r.student_id);
 const players=students.filter(s=>!s.is_admin&&ids.includes(s.id));
 return <label>{label}{teamId?<select value={value?.student_id||''} onChange={e=>onChange(e.target.value?{side,student_id:e.target.value}:null)}>
  <option value="">Not recorded</option>{players.map(s=><option value={s.id} key={s.id}>{s.name} ({s.matric_number})</option>)}
 </select>:<input maxLength={120} value={value?.name||''} placeholder="Optional match-only player name" onChange={e=>onChange(e.target.value.trim()?{side,name:e.target.value}:null)}/>}
 </label>;
}

export default function MatchPlayerDetails({fixture,teams,students,roster,value,onChange,pending,onSave}) {
 const names={home:sideTeam(fixture,teams,'home').name,away:sideTeam(fixture,teams,'away').name};
 const motm=value.man_of_the_match,goals=value.goals||[];
 function setGoal(index,patch){onChange({...value,goals:goals.map((g,i)=>i===index?{...g,...patch}:g)});}
 return <section className="form-panel form-stack section" aria-label="Match player details">
  <h2>Match player details <small>(optional)</small></h2>
  <p className="help">Set these before End Match. Leave them blank if not recorded. End Match saves your entries and locks them.</p>
  <fieldset disabled={pending} className="form-stack"><legend>Man of the Match</legend>
   <label>Player team<select value={motm?.side||''} onChange={e=>onChange({...value,man_of_the_match:e.target.value?{side:e.target.value}:null})}>
    <option value="">Not selected</option>{['home','away'].map(side=><option value={side} key={side}>{names[side]}</option>)}
   </select></label>
   {motm?.side&&<PlayerChoice label="Player" side={motm.side} value={motm} onChange={player=>onChange({...value,man_of_the_match:player||{side:motm.side}})} fixture={fixture} students={students} roster={roster}/>}
  </fieldset>
  {fixture.sport==='football'&&<fieldset disabled={pending} className="form-stack"><legend>Goals and assists</legend>
   <p className="help">Record the team score with the score buttons first. Add one entry per goal you want to attribute. Scorer and assist are optional; adding an entry does not change the score.</p>
   {goals.map((g,index)=><div key={index} className="form-panel form-stack">
    <label>Goal {index+1}: scoring team<select value={g.side} onChange={e=>setGoal(index,{side:e.target.value,scorer:null,assist:null})}>
     {['home','away'].map(side=><option value={side} key={side}>{names[side]}</option>)}
    </select></label>
    <div className="form-grid"><PlayerChoice label="Goalscorer" side={g.side} value={g.scorer} onChange={player=>setGoal(index,{scorer:player})} fixture={fixture} students={students} roster={roster}/>
    <PlayerChoice label="Assist" side={g.side} value={g.assist} onChange={player=>setGoal(index,{assist:player})} fixture={fixture} students={students} roster={roster}/></div>
    <Button type="button" variant="secondary" onClick={()=>onChange({...value,goals:goals.filter((_,i)=>i!==index)})}>Remove goal {index+1} entry</Button>
   </div>)}
   <Button type="button" variant="secondary" disabled={goals.length>=100} onClick={()=>onChange({...value,goals:[...goals,{side:'home',scorer:null,assist:null}]})}>Add goal entry</Button>
  </fieldset>}
  <Button type="button" disabled={pending} onClick={onSave}>Save player details</Button>
 </section>;
}
