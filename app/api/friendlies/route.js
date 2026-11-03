import {api,rpc,uuid,required,timestamp,HttpError} from '@/lib/api';
export const POST=api(async(request,{db})=>{
 const b=await request.json();
 const ids=value=>{if(value==null)return null;if(!Array.isArray(value))throw new HttpError('Select registered players.');return value.map(uuid);};
 return {id:await rpc(db,'admin_create_friendly',{
  p_sport:b.sport,p_home_team_id:b.home_team_id?uuid(b.home_team_id):null,p_away_team_id:b.away_team_id?uuid(b.away_team_id):null,
  p_home_name:b.home_team_id?null:required(b.home_name,'Home team name'),p_away_name:b.away_team_id?null:required(b.away_name,'Away team name'),
  p_save_home:b.save_home===true,p_save_away:b.save_away===true,p_home_student_ids:ids(b.home_student_ids),p_away_student_ids:ids(b.away_student_ids),
  p_best_of:b.sport==='volleyball'?Number(b.best_of):null,p_scheduled_at:b.scheduled_at?timestamp(b.scheduled_at):null,p_venue:typeof b.venue==='string'?b.venue.trim()||null:null
 })};
});
