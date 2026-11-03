import {api,rpc,uuid} from '@/lib/api';
export const POST=api(async(request,{db,params})=>{
 const b=await request.json();return rpc(db,'admin_walkover',{p_fixture_id:uuid(params.fixtureId),p_winner:b.winner});
});
