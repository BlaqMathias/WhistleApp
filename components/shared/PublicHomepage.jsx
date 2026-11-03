'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {SPORTS,SPORT_NAMES} from '@/lib/constants';
import {fixtureTime} from '@/lib/sports';
import {accountHome,matchHref} from '@/lib/account';
import PublicHeader from './PublicHeader';
import Logo from './Logo';
import Court from './Court';
import Icon from './Icon';
import MatchBoard from './MatchBoard';
import StandingsPreview from './StandingsPreview';
import EmptyState from './EmptyState';
import Refresh from './Refresh';
import RefreshButton from './RefreshButton';

export default function PublicHomepage({data:d,account}) {
 const query=useSearchParams(),sport=SPORTS.includes(query.get('sport'))?query.get('sport'):'';
 const fixtures=d?d.fixtures.filter(f=>!sport||f.sport===sport):[];
 const live=fixtures.filter(f=>f.status==='live');
 const recent=fixtures.filter(f=>['completed','walkover'].includes(f.status)).sort((a,b)=>fixtureTime(b)-fixtureTime(a)).slice(0,3);
 const upcoming=fixtures.filter(f=>f.status==='scheduled').sort((a,b)=>fixtureTime(a)-fixtureTime(b)).slice(0,6);
 const feature=live[0]||upcoming[0]||recent[0],destination=account?accountHome(account):'/signup';
 const predictionFixture=upcoming[0]||feature;
 const predictionPath=predictionFixture?matchHref(predictionFixture.id):'/student/fixtures';
 const predictionLink=account?predictionPath:predictionFixture?`/login?next=${encodeURIComponent(predictionPath)}`:'/login';
 const filter=e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();window.history.pushState(null,'',e.currentTarget.href);};
 const match=(f,featured=false)=><article className="home-match" key={f.id}><MatchBoard fixture={f} teams={d.teams} leagues={d.leagues} featured={featured}/></article>;
 return <div className="public-site"><Refresh/><PublicHeader account={account}/>
  <main id="main" className="public-home">
   <section className="home-intro"><div className="home-intro-copy"><Court/><p className="home-campus-line">Campus sports, all in one place.</p><h1>Every match.<br/>Our <em>campus.</em></h1><p className="home-intro-description">Follow the score, pick your winners, and see who’s climbing the league tables. This is Topfaith matchday.</p><div className="actions"><Link className="button" href={account?'/#scores':'/login'}>Find the action</Link><Link className="quiet-link" href={predictionLink}>Make your next prediction</Link></div></div>
    <div className="home-feature">{feature?<><div className="home-feature-caption">{feature.status==='live'?'On the field right now':feature.status==='scheduled'?'The next matchup':'From the last whistle'}</div>{match(feature,true)}</>:<div className="home-pitch"><Court/><div><h2>The next whistle<br/>is coming.</h2><p>The campus schedule starts here.</p></div></div>}</div>
   </section>
   {d?<>
    <section id="scores" className="home-section"><div className="home-section-heading"><h2>Match centre</h2><nav className="home-sports" aria-label="Filter sports"><a href="/#scores" onClick={filter} aria-current={!sport?'page':undefined}>All sports</a>{SPORTS.map(s=><a key={s} href={`/?sport=${s}#scores`} onClick={filter} aria-current={sport===s?'page':undefined}><Icon name={s}/>{SPORT_NAMES[s]}</a>)}</nav></div>
     {live.length?<div className="home-live-grid">{live.map(f=>match(f,true))}</div>:<EmptyState title="Between whistles">The next match and latest results are right below.</EmptyState>}
     {recent.length>0&&<div className="home-recent"><h3>Latest results</h3><div className="home-result-grid">{recent.map(f=>match(f))}</div></div>}
    </section>
    <section id="fixtures" className="home-section"><div className="home-section-heading"><h2>Next on campus</h2><Link className="quiet-link" href={account?.is_admin?'/friendlies':account?'/student/fixtures':'/login'}>{account?'Full schedule':'Log in for the full schedule'}</Link></div>{upcoming.length?<div className="home-fixture-grid">{upcoming.map(f=>match(f))}</div>:<EmptyState title="The schedule is taking shape">Upcoming league matches and Friendlies appear here.</EmptyState>}</section>
    <section id="standings" className="home-section"><div className="home-section-heading"><h2>The race for the top</h2><Link className="quiet-link" href={account?.is_admin?'/leagues':account?'/student/standings':'/login'}>All league tables</Link></div>{SPORTS.filter(s=>!sport||s===sport).map(s=>{const l=[...d.leagues].filter(l=>l.sport===s).sort((a,b)=>b.created_at.localeCompare(a.created_at))[0];return <section className="home-league" key={s}><h3 className="section-title">{SPORT_NAMES[s]}</h3>{l?<><p className="home-league-name">{l.name} / {l.season}</p><StandingsPreview league={l} standings={d.standings.filter(r=>r.league_id===l.id)} maxRows={5}/></>:<EmptyState title="A new season awaits">No active league for this sport yet.</EmptyState>}</section>;})}</section>
   </>:<section className="home-section"><EmptyState title="Scores are temporarily unavailable">We couldn’t load the latest updates. Please try again.</EmptyState><RefreshButton/></section>}
   <section className="home-invitation"><div><h2>Pick your side.<br/><em>Earn your Ws</em>.</h2><p>Make your matchday predictions and follow the campus leaderboard.</p></div><Link href={destination} className="button">{account?'Open your overview':'Create your account'}</Link></section>
  </main>
  <footer className="public-footer"><Link href="/" className="brand"><Logo/></Link><p>Made for matchdays at Topfaith University.</p></footer>
 </div>;
}
