'use client';
import {useState} from 'react';
import Button from '@/components/shared/Button';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
import {SPORTS,SPORT_NAMES} from '@/lib/constants';
export default function LeagueForm({teams}){
 const [sport,setSport]=useState('football'),[selected,setSelected]=useState([]),m=useMutation();
 const choices=teams.filter(t=>t.sport===sport&&t.status==='active');
 async function submit(e){e.preventDefault();const f=new FormData(e.currentTarget);await m.run(async()=>{
  if(selected.length<2)throw new Error('Choose at least two active teams.');
  const result=await send('/api/leagues',{name:f.get('name'),sport,season:f.get('season'),best_of:f.get('best_of'),team_ids:selected});m.router.push(`/leagues/${result.id}`);
 },'League and fixtures created.');}
 return <form className="form-panel form-stack" onSubmit={submit}><label>League name<input name="name" maxLength={160} required/></label><div className="form-grid"><label>Sport<select value={sport} onChange={e=>{setSport(e.target.value);setSelected([]);}}>{SPORTS.map(s=><option key={s} value={s}>{SPORT_NAMES[s]}</option>)}</select></label><label>Season / session<input name="season" placeholder="2026/2027" maxLength={80} required/></label></div>{sport==='volleyball'&&<label>Volleyball format<select name="best_of" defaultValue="3"><option value="3">Best of three</option><option value="5">Best of five</option></select></label>}<fieldset><legend>Enrolled teams</legend><div className="selection-list">{choices.map(t=><label key={t.id}><input type="checkbox" checked={selected.includes(t.id)} onChange={()=>setSelected(selected.includes(t.id)?selected.filter(id=>id!==t.id):[...selected,t.id])}/>{t.name}</label>)}</div>{!choices.length&&<p className="help">Create active {SPORT_NAMES[sport]} teams first.</p>}</fieldset><p className="form-note">{selected.length} teams / {selected.length*(selected.length-1)} home-and-away fixtures. You can edit dates, add matches or remove unstarted fixtures afterward. A player can represent one team in this league.</p><FormStatus {...m}/><Button disabled={m.pending}>Create league and draft fixtures</Button></form>;
}
