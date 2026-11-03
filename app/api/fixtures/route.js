import {api,rpc,uuid} from '@/lib/api';
export const POST=api(async(request,{db})=>{
  const b=await request.json();
  return {id:await rpc(db,'admin_add_fixture',{p_league_id:uuid(b.league_id),p_home:uuid(b.home_team_id),p_away:uuid(b.away_team_id)})};
});
