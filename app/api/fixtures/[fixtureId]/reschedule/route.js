import {api,rpc,uuid,timestamp} from '@/lib/api';
export const POST=api(async(request,{db,params})=>{
 const b=await request.json();
 return rpc(db,'admin_reschedule',{p_fixture_id:uuid(params.fixtureId),p_scheduled_at:b.scheduled_at?timestamp(b.scheduled_at):null,p_venue:typeof b.venue==='string'?b.venue.trim():null});
});
