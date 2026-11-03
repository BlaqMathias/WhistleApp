import {api,rpc,uuid} from '@/lib/api';
export const DELETE=api(async(_,{db,params})=>rpc(db,'admin_delete_fixture',{p_fixture_id:uuid(params.fixtureId)}));
