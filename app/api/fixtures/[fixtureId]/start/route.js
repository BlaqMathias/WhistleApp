import {api,rpc,uuid} from '@/lib/api';
export const POST=api(async(_,{db,params})=>rpc(db,'admin_start',{p_fixture_id:uuid(params.fixtureId)}));
