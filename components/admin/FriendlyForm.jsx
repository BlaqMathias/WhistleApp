'use client';
import {useState} from 'react';
import Button from '@/components/shared/Button';
import RosterEditor from './RosterEditor';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
import {SPORTS,SPORT_NAMES} from '@/lib/constants';
import {fromInput} from '@/lib/format';
const empty=()=>({mode:'existing',team:'',name:'',save:false,players:[]});
export default function FriendlyForm({teams,students}){
 const [sport,setSport]=useState('football'),[sides,setSides]=useState({home:empty(),away:empty()}),m=useMutation();
 const update=(side,key,value)=>setSides(previous=>({...previous,[side]:{...previous[side],[key]:value}}));
 async function submit(e){e.preventDefault();const f=new FormData(e.currentTarget);await m.run(async()=>{
  const body={sport,best_of:f.get('best_of'),scheduled_at:fromInput(f.get('scheduled_at')),venue:f.get('venue')};
  for(const side of ['home','away']){const x=sides[side];body[`${side}_team_id`]=x.mode==='existing'?x.team:null;body[`${side}_name`]=x.name;body[`save_${side}`]=x.mode==='typed'&&x.save;body[`${side}_student_ids`]=x.players;if(x.mode==='typed'&&x.save&&!x.players.length)throw new Error('Choose at least one registered player when saving a reusable team.');}
  const result=await send('/api/friendlies',body);m.router.push(`/fixtures/${result.id}`);
 },'Friendly created.');}
 return <form className="form-stack" onSubmit={submit}><div className="form-panel form-stack"><label>Sport<select value={sport} onChange={e=>{setSport(e.target.value);setSides({home:empty(),away:empty()});}}>{SPORTS.map(s=><option key={s} value={s}>{SPORT_NAMES[s]}</option>)}</select></label>{sport==='volleyball'&&<label>Volleyball format<select name="best_of" defaultValue="3"><option value="3">Best of three</option><option value="5">Best of five</option></select></label>}</div><div className="friendly-sides">{['home','away'].map(side=>{
  const x=sides[side];return <section className="form-panel form-stack" key={side}><h2>{side==='home'?'Home team':'Away team'}</h2><label>Team source<select value={x.mode} onChange={e=>update(side,'mode',e.target.value)}><option value="existing">Choose an existing team</option><option value="typed">Type a club name</option></select></label>{x.mode==='existing'?<label>Team<select required value={x.team} onChange={e=>update(side,'team',e.target.value)}><option value="">Select a team</option>{teams.filter(t=>t.sport===sport&&t.status==='active').map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>:<><label>Club name<input required maxLength={120} value={x.name} onChange={e=>update(side,'name',e.target.value)}/></label><label className="inline-check"><input type="checkbox" checked={x.save} onChange={e=>update(side,'save',e.target.checked)}/>Save as a reusable team</label>{x.save&&<RosterEditor students={students} selected={x.players} onChange={ids=>update(side,'players',ids)}/>}<p className="help">{x.save?'A saved team needs a registered player.':'This name stays within this Friendly.'} You can upload a logo on the match page.</p></>}</section>;
 })}</div><div className="form-panel form-stack"><div className="form-grid"><label>Kick-off (WAT, optional)<input type="datetime-local" name="scheduled_at"/></label><label>Venue (optional)<input name="venue" maxLength={200}/></label></div><p className="form-note">Predictions open when you create this Friendly. Start Match closes voting.</p><FormStatus {...m}/><Button disabled={m.pending}>Create Friendly</Button></div></form>;
}
