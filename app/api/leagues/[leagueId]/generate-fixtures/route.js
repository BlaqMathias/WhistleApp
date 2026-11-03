import {api,rpc,uuid} from '@/lib/api';
export const POST=api(async(_, {db,params})=>({count:await rpc(db,'admin_generate_fixtures',{p_league_id:uuid(params.leagueId)})}));
