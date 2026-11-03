import Link from 'next/link';
import {getData} from '@/lib/data';
import {SPORTS, SPORT_NAMES} from '@/lib/constants';
import TeamMark from '@/components/shared/TeamMark';
import Badge from '@/components/shared/Badge';
import EmptyState from '@/components/shared/EmptyState';
import Icon from '@/components/shared/Icon';
function TeamsTable({teams, data}) {
  return <div className="team-card-grid">{teams.map(t => <Link className="team-card" key={t.id} href={`/teams/${t.id}`}><div className="team-card-top"><TeamMark name={t.name} initials={t.logo_initials} path={t.logo_path}/><Badge status={t.status}/></div><h3>{t.name}</h3><div className="team-card-bottom"><span>{data.team_players.filter(p => p.team_id === t.id).length} players</span><span className="quiet-link">Open team <Icon name="chevron-right"/></span></div></Link>)}</div>;
}
export default async function Teams() {
  const d = await getData();
  return <><div className="page-heading"><div><h1>Teams</h1><p>The players behind every match.</p></div><Link className="button" href="/teams/new"><Icon name="plus"/>Create team</Link></div>{SPORTS.map(s => {
    const teams = d.teams.filter(t => t.sport === s && t.status === 'active').sort((a,b) => a.name.localeCompare(b.name));
    return <section className="section" key={s}><div className="section-header"><h2>{SPORT_NAMES[s]}</h2><span className="help">{teams.length} teams</span></div>{teams.length ? <TeamsTable teams={teams} data={d}/> : <EmptyState title={`No ${SPORT_NAMES[s]} teams yet`}>Create a team with at least one registered player.</EmptyState>}</section>;
  })}<details className="archive-section"><summary>Archived teams</summary><TeamsTable teams={d.teams.filter(t => t.status === 'archived')} data={d}/></details></>;
}
