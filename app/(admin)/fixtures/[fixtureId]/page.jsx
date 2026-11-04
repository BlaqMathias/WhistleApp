import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getData} from '@/lib/data';
import {adminClient} from '@/lib/supabase/admin';
import {rpc} from '@/lib/api';
import MatchBoard, {MatchPlayerSummary} from '@/components/shared/MatchBoard';
import Refresh from '@/components/shared/Refresh';
import MatchControls from '@/components/admin/MatchControls';
import LogoEditor from '@/components/admin/LogoEditor';
import PollWidget from '@/components/student/PollWidget';
export default async function Fixture({params}){
 const {fixtureId}=await params,d=await getData(),f=d.fixtures.find(f=>f.id===fixtureId);if(!f)notFound();
 const l=d.leagues.find(l=>l.id===f.league_id),archived=l?.status==='archived';
 const poll=archived?null:await rpc(adminClient(),'whistle_poll_snapshot',{p_fixture_id:f.id,p_student_id:null});
 return <><Refresh/><Link className="back-link" href={l?`/leagues/${l.id}`:'/friendlies'}>Back to {l?'league':'Friendlies'}</Link><div className="page-heading"><h1>Match day</h1></div><div className="match-overview"><MatchBoard fixture={f} teams={d.teams} leagues={d.leagues} featured showPlayerDetails={false}/></div><MatchPlayerSummary fixture={f} teams={d.teams} panel/>{archived&&<p className="form-message">This league is archived. Its match history is retained.</p>}<MatchControls key={f.id} fixture={f} teams={d.teams} students={d.students} roster={f.league_id?d.league_players.filter(r=>r.league_id===f.league_id):d.team_players} archived={archived}/><section className="section"><PollWidget fixture={f} teams={d.teams} poll={poll} publicView adminView/></section>{!f.league_id&&<section className="section"><h2 className="section-title">Friendly logos</h2><div className="friendly-sides">{['home','away'].map(side=>{const team=d.teams.find(t=>t.id===f[`${side}_team_id`]);return <LogoEditor key={side} entity={team?'teams':'fixtures'} id={team?.id||f.id} side={team?undefined:side} path={team?.logo_path||f[`${side}_logo_path`]} label={`${side==='home'?'Home':'Away'} team logo${team?' (reusable)':''}`}/>;})}</div></section>}</>;
}
