import {api,rpc,uuid} from '@/lib/api';
export const POST=api(async(request,{db,params})=>{
  const body=await request.json();
  await rpc(db,'admin_add_league_team',{p_league_id:uuid(params.leagueId),p_team_id:uuid(body.team_id)});
  return {ok:true};
});
