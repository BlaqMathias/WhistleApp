import {api,rpc,uuid,integer} from '@/lib/api';
export const POST=api(async(request,{db,params})=>{
  const b=await request.json();
  return rpc(db,'admin_record_result',{p_fixture_id:uuid(params.fixtureId),p_home_sets:integer(b.home_sets),p_away_sets:integer(b.away_sets)});
});
