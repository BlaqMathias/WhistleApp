import {api,rpc,uuid,integer} from '@/lib/api';
export const POST=api(async(request,{db,params})=>{
  const b=await request.json();
  return rpc(db,'admin_correct_result',{p_fixture_id:uuid(params.fixtureId),p_home:b.home==null?null:integer(b.home),p_away:b.away==null?null:integer(b.away),p_winner:b.winner||null});
});
