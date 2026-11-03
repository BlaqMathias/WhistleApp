import {api,rpc} from '@/lib/api';
export const GET=api(async(_,{db,account})=>rpc(db,'student_leaderboard',{p_student_id:account.id}),{access:'student'});
