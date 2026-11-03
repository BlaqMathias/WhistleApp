import {asDate} from './format.js';
export function sideTeam(fixture, teams, side) {
  const team = teams.find(t => t.id === fixture[`${side}_team_id`]);
  return {name:team?.name || fixture[`${side}_name`], initials:team?.logo_initials || fixture[`${side}_initials`], logo:fixture[`${side}_logo_path`] || team?.logo_path};
}
export function logoUrl(path) {
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_WHISTLE_DEMO === '1') return path ? `/__test_supabase/storage/v1/object/public/team-logos/${path.split('/').map(encodeURIComponent).join('/')}` : null;
  return path ? `${(process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/,'')}/storage/v1/object/public/team-logos/${path.split('/').map(encodeURIComponent).join('/')}` : null;
}
export function fixtureScore(f) {
  if (f.status === 'walkover') return 'Walkover';
  if (f.status === 'cancelled') return 'Cancelled';
  if (f.sport === 'volleyball') return f.home_sets != null ? `${f.home_sets} : ${f.away_sets} sets` : f.status === 'live' ? f.ended_at ? 'Result pending' : 'In play' : 'vs';
  return f.home_score == null ? 'vs' : `${f.home_score} : ${f.away_score}`;
}
export function outcome(f, teams) {
  if (f.status === 'cancelled') return 'Match cancelled. Predictions are void; Ws are unchanged.';
  if (f.status === 'walkover') return `${sideTeam(f,teams,f.winner_side).name} won by walkover. Predictions are void; Ws are unchanged.`;
  if (f.status !== 'completed') return f.status === 'live' ? 'Voting closed when the match started.' : 'Voting is closed.';
  return f.winner_side ? `${sideTeam(f,teams,f.winner_side).name} won.` : 'Final result: Draw.';
}
export const competition = (f, leagues) => leagues.find(l => l.id === f.league_id)?.name || 'Friendly';
export const fixtureTime = f => asDate(f.ended_at || f.started_at || f.scheduled_at || f.created_at).getTime();
export const wsText = value => `${Number(value)>0?'+':''}${Number(value || 0).toLocaleString('en-NG')} Ws`;
export const SET_SCORES = best => {
  const target = (best + 1) / 2, values=[];
  for(let i=0;i<target;i++) values.push(`${target}-${i}`,`${i}-${target}`);
  return values;
};
