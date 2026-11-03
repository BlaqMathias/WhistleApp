import Link from 'next/link';
import {getData} from '@/lib/data';
import {SPORT_NAMES} from '@/lib/constants';
import Badge from '@/components/shared/Badge';
import EmptyState from '@/components/shared/EmptyState';
import Court from '@/components/shared/Court';
import Icon from '@/components/shared/Icon';
import LeagueMark from '@/components/shared/LeagueMark';
function Table({leagues, data}) {
  return <div className="league-card-grid">{leagues.map(l => <Link className="league-card" key={l.id} href={`/leagues/${l.id}`}><Court sport={l.sport}/><div className="league-card-content"><div className="section-header"><span className="help">{SPORT_NAMES[l.sport]}</span><Badge status={l.status}/></div><div className="league-heading"><LeagueMark league={l}/><h2>{l.name}</h2></div><p className="help">{l.season}{l.best_of ? ` / Best of ${l.best_of}` : ''}</p><div className="league-card-stats"><span><Icon name="users"/>{data.league_teams.filter(t => t.league_id === l.id).length} teams</span><span><Icon name="check"/>{data.fixtures.filter(f => f.league_id === l.id && ['completed','walkover'].includes(f.status)).length} / {data.fixtures.filter(f => f.league_id === l.id && f.status !== 'cancelled').length} played</span></div><span className="quiet-link">Open league <Icon name="chevron-right"/></span></div></Link>)}</div>;
}
export default async function Leagues() {
  const d = await getData();
  return <><div className="page-heading"><div><h1>Leagues</h1><p>Home and away. Every point counts.</p></div><Link className="button" href="/leagues/new"><Icon name="plus"/>Create league</Link></div>{d.leagues.some(l => l.status === 'active') ? <Table leagues={d.leagues.filter(l => l.status === 'active')} data={d}/> : <EmptyState title="No active leagues">Enrol teams to draft their home-and-away fixtures.</EmptyState>}<details className="archive-section"><summary>Archived leagues</summary><Table leagues={d.leagues.filter(l => l.status === 'archived')} data={d}/></details></>;
}
