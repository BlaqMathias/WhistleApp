import Link from 'next/link';
import {getData} from '@/lib/data';
import Refresh from '@/components/shared/Refresh';
import MatchBoard from '@/components/shared/MatchBoard';
import FixtureList from '@/components/shared/FixtureList';
import EmptyState from '@/components/shared/EmptyState';
import Icon from '@/components/shared/Icon';
import Court from '@/components/shared/Court';
export default async function Dashboard(){
 const d=await getData(),live=d.fixtures.filter(f=>f.status==='live'),unscheduled=d.fixtures.filter(f=>f.status==='scheduled'&&!f.scheduled_at&&(!f.league_id||d.leagues.some(l=>l.id===f.league_id&&l.status==='active')));
 const cards=[['Live now',live.length,'#live-now','live'],['Need a date',unscheduled.length,'#unscheduled','calendar'],['Active leagues',d.leagues.filter(l=>l.status==='active').length,'/leagues','trophy']];
 return <>
  <Refresh/>
  <div className="page-heading">
   <div><h1>Match desk</h1><p>Set the schedule. Call the first whistle.</p></div>
  </div>
  <section className="hero-card">
   <Court/>
   <span className="hero-kicker">Topfaith sports administration</span>
   <h2>Set the stage.<br/><em>Call the whistle.</em></h2>
   <div className="actions section">
    <Link className="button secondary small" href="/teams/new">Create team</Link>
    <Link className="button small" href="/leagues/new">Create league</Link>
   </div>
  </section>
  <div className="quick-grid">{cards.map(([label,count,href,icon])=><Link className="quick-tile" href={href} key={label}><Icon name={icon}/><span className="tile-count">{count}</span><span>{label}</span></Link>)}</div><section id="live-now"><div className="section-header"><h2>On the field</h2></div>{live.length?live.map(f=><MatchBoard key={f.id} fixture={f} teams={d.teams} leagues={d.leagues} linked featured/>):<EmptyState title="No matches live right now">Open a fixture and click Start Match when play begins.</EmptyState>}</section><section className="section" id="unscheduled"><div className="section-header"><h2>Build the matchday</h2><Link className="quiet-link" href="/leagues">View leagues</Link></div><FixtureList fixtures={unscheduled} teams={d.teams} leagues={d.leagues} admin/></section></>;
}
