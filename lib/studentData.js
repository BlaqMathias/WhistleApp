import 'server-only';
import {cache} from 'react';
import {redirect} from 'next/navigation';
import {currentAccount} from './auth.js';
import {adminClient} from './supabase/admin.js';
import {rpc} from './api.js';
function studentRead(name) {
  return cache(async sport=>{
    const account=await currentAccount();
    if(!account) redirect('/login');
    if(account.is_admin) redirect('/dashboard');
    const args = {p_student_id: account.id};
    if (sport) args.p_sport = sport;
    return {account, data: await rpc(adminClient(), name, args)};
  });
}
export const getStudentOverview=studentRead('student_overview');
export const getStudentProfile=studentRead('student_profile');
export const getStudentNotifications=studentRead('student_notifications');
export const getStudentLeaderboard=studentRead('student_leaderboard');
export const getStudentPredictionHistory=studentRead('student_prediction_history');
export const getStudentSportLeaderboard=studentRead('student_sport_leaderboard');
