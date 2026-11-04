'use client';
import {useState,useRef} from 'react';
import RosterEditor from './RosterEditor';
import Button from '@/components/shared/Button';
import {useMutation,send} from '@/components/shared/FormState';
import {SPORTS,SPORT_NAMES} from '@/lib/constants';
import {uploadLogo} from '@/lib/logoUpload';
export default function TeamForm({students,team,playerIds=[]}){
 const [selected,setSelected]=useState(playerIds),[sport,setSport]=useState(team?.sport||'football');
 const savedId=useRef(team?.id),[created,setCreated]=useState(false),m=useMutation();
 async function submit(e){e.preventDefault();const f=new FormData(e.currentTarget);await m.run(async()=>{
  if(!selected.length)throw new Error('Add at least one registered student.');
  const result=await send(savedId.current?`/api/teams/${savedId.current}`:'/api/teams',{name:f.get('name'),sport,student_ids:selected},savedId.current?'PATCH':'POST');
  savedId.current=result.id;setCreated(true);
  const logo=f.get('logo');if(logo?.size)await uploadLogo(logo,'teams',result.id);
  m.router.push(`/teams/${result.id}`);
 },'Team saved.');}
 return <form onSubmit={submit} className="form-panel form-stack"><div className="form-grid"><label>Team name<input name="name" required maxLength={120} defaultValue={team?.name}/></label><label>Sport<select value={sport} disabled={!!team||created} onChange={e=>setSport(e.target.value)}>{SPORTS.map(s=><option value={s} key={s}>{SPORT_NAMES[s]}</option>)}</select></label></div>
  {!team&&<label>Team logo (optional)<input type="file" name="logo" accept="image/png,image/jpeg,image/webp"/><span className="help">Use PNG, JPG or WebP up to 2 MB, or leave empty for initials.</span></label>}
  <RosterEditor students={students} selected={selected} onChange={setSelected}/><Button disabled={m.pending}>{m.pending?'Saving…':team||created?'Save team':'Create team'}</Button>
 </form>;
}
