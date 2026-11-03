import Link from 'next/link';
import {getStudentOverview} from '@/lib/studentData';
import {fixtureTime, wsText} from '@/lib/sports';
import {SPORT_NAMES} from '@/lib/constants';
import MatchBoard from '@/components/shared/MatchBoard';
import TeamMark from '@/components/shared/TeamMark';
import FixtureList from '@/components/shared/FixtureList';
import StandingsPreview from '@/components/shared/StandingsPreview';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
import Court from '@/components/shared/Court';
import Icon from '@/components/shared/Icon';
export const metadata = {title: 'Your campus sports'};
export default async function Overview() {
  const {account, data: d} = await getStudentOverview(), mine = f => d.my_team_ids.includes(f.home_team_id) || d.my_team_ids.includes(f.away_team_id);
  const live = d.fixtures.filter(f => f.status === 'live').sort((a,b) => Number(mine(b)) - Number(mine(a))), upcoming = d.fixtures.filter(f => f.status === 'scheduled').sort((a,b) => fixtureTime(a) - fixtureTime(b));
  const recent = d.fixtures.filter(f => ['completed','walkover'].includes(f.status)).sort((a,b) => Number(mine(b)) - Number(mine(a)) || fixtureTime(b) - fixtureTime(a)).slice(0,3);
  const leagues = [...d.leagues].sort((a,b) => Number(d.standings.some(r => r.league_id === b.id && d.my_team_ids.includes(r.team_id))) - Number(d.standings.some(r => r.league_id === a.id && d.my_team_ids.includes(r.team_id))) || b.created_at.localeCompare(a.created_at));
  const glance = leagues.filter((l,i) => leagues.findIndex(x => x.sport === l.sport) === i), feature = live[0] || upcoming[0];
  const tiles = [['Fixtures', upcoming.length, '/student/fixtures', 'calendar'], ['Live now', live.length, '/student/live', 'live'], ['League tables', d.leagues.length, '/student/standings', 'trophy']];
  return <><Refresh/><div className="greeting-row"><div><p>{account.name}'s campus sports</p><h1>Your matchday.</h1></div><Link className="ws-pill" href="/student/leaderboard">{wsText(d.ws)}<Icon name="chevron-right"/></Link></div>
    <div className="overview-hero-grid"><section className="hero-card"><Court/><span className="hero-kicker">Topfaith University / {live.length} live now</span><h2>Every match.<br/>Our <em>campus.</em></h2><p>{d.my_polls.filter(p => p.can_vote).length} open predictions. Make your pick before the first whistle.</p><div><Link className="button" href="/student/fixtures?status=scheduled">Make your predictions <Icon name="chevron-right"/></Link></div></section>
    {feature ? <section><div className="section-header"><h2>{feature.status === 'live' ? 'On the field' : 'Up next'}</h2><Link className="quiet-link" href="/student/live">Match centre</Link></div><MatchBoard fixture={feature} teams={d.teams} leagues={d.leagues} featured/></section> : <EmptyState title="Between whistles">Make your predictions before the next match starts.</EmptyState>}</div>
    <div className="quick-grid">{tiles.map(([label, count, href, icon]) => <Link className="quick-tile" href={href} key={label}><Icon name={icon}/><span className="tile-count">{count}</span><span>{label}</span></Link>)}</div>
    {live.length > 1 && <div className="live-grid">{live.slice(1,3).map(f => <article key={f.id}><MatchBoard fixture={f} teams={d.teams} leagues={d.leagues}/></article>)}</div>}
    <section className="section" id="my-teams"><h2 className="section-title">My teams</h2>{d.my_team_ids.length ? <div className="student-teams">{d.teams.filter(t => d.my_team_ids.includes(t.id)).map(t => <div className="student-team" key={t.id}><TeamMark name={t.name} initials={t.logo_initials} path={t.logo_path}/><div><strong>{t.name}</strong><span className="table-sub">{SPORT_NAMES[t.sport]}</span></div></div>)}</div> : <EmptyState title="Follow the campus action">When the administrator adds you to a roster, your team appears here.</EmptyState>}</section>
    <section className="section"><div className="section-header"><h2>Make your call</h2><Link href="/student/fixtures" className="quiet-link">All fixtures</Link></div><FixtureList fixtures={upcoming.slice(0,4)} teams={d.teams} leagues={d.leagues} polls={d.my_polls} myTeamIds={d.my_team_ids} predictions/></section>
    <Link href="/student/leaderboard" className="profile-link section"><Icon name="trophy"/><span>Campus Ws leaderboard<span className="table-sub">Your balance: {wsText(d.ws)}</span></span><Icon name="chevron-right"/></Link>
    {recent.length > 0 && <section className="section"><h2 className="section-title">Latest results</h2><FixtureList fixtures={recent} teams={d.teams} leagues={d.leagues} polls={d.my_polls} myTeamIds={d.my_team_ids} predictions/></section>}
    <section className="section"><div className="section-header"><h2>Standings glance</h2><Link href="/student/standings" className="quiet-link">All tables</Link></div>{glance.length ? glance.map(l => <section className="section" key={l.id}><h3 className="section-title">{l.name}</h3><StandingsPreview league={l} standings={d.standings.filter(r => r.league_id === l.id)} myTeamIds={d.my_team_ids} maxRows={5}/></section>) : <EmptyState title="A new season awaits">League tables appear when competitions are created.</EmptyState>}</section>
  </>;
}
