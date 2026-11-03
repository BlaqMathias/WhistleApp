import {api,rpc,uuid,required} from '@/lib/api';
export const POST=api(async(request,{db,params})=>{
  const b=await request.json();
  return rpc(db,'admin_cancel',{p_fixture_id:uuid(params.fixtureId),p_reason:required(b.reason,'Cancellation reason')});
});
