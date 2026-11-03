import '../../home.css';
import Link from 'next/link';
import {notFound,redirect} from 'next/navigation';
import {currentAccount} from '@/lib/auth';
import {getPublicFixture} from '@/lib/publicData';
import {matchReturnPath,matchHref} from '@/lib/account';
import PublicHeader from '@/components/shared/PublicHeader';
import MatchBoard from '@/components/shared/MatchBoard';
import FixtureEvents from '@/components/shared/FixtureEvents';
import FixtureTabs from '@/components/shared/FixtureTabs';
import StandingsPreview from '@/components/shared/StandingsPreview';
import Refresh from '@/components/shared/Refresh';
import LeagueMark from '@/components/shared/LeagueMark';

export const dynamic='force-dynamic';
export const metadata={title:'Match centre'};
export default async function Match({params,searchParams}) {
 const {fixtureId}=await params;
 const account=await currentAccount();
 const initialTab=(await searchParams)?.tab==='squad'?'squad':'predictions';
 if(!account){const next=matchReturnPath(matchHref(fixtureId,initialTab));redirect(next?`/login?next=${encodeURIComponent(next)}`:'/login');}
 if(!matchReturnPath(`/matches/${fixtureId}`))notFound();
 const data=await getPublicFixture(fixtureId);
 if(!data)notFound();
 const {fixture,teams,league,standings,squads,poll}=data;
 const viewer=account?{is_admin:account.is_admin}:null;
 return <div className="public-site"><Refresh/><PublicHeader account={viewer}/><main id="main" className="fixture-detail">
  <Link href={account.is_admin?'/friendlies':'/student/fixtures'} className="back-link">All fixtures</Link>
  <MatchBoard fixture={fixture} teams={teams} leagues={league?[league]:[]} featured showPlayerDetails={false}/>
  <FixtureEvents fixture={fixture} teams={teams}/>
  <FixtureTabs fixture={fixture} teams={teams} squads={squads} poll={poll} account={viewer} initialTab={initialTab}/>
  {league&&<section className="fixture-league-table"><div className="section-header"><h2>Standings</h2><span className="league-heading help"><LeagueMark league={league}/>{league.name}</span></div><StandingsPreview league={league} standings={standings}/></section>}
 </main></div>;
}
