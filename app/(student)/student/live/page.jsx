import Link from 'next/link';
import {getStudentOverview} from '@/lib/studentData';
import {fixtureTime} from '@/lib/sports';
import MatchBoard from '@/components/shared/MatchBoard';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
export const metadata={title:'Live matches'};
export default async function Live(){const {data:d}=await getStudentOverview(),live=d.fixtures.filter(f=>f.status==='live'),recent=d.fixtures.filter(f=>['completed','walkover','cancelled'].includes(f.status)).sort((a,b)=>fixtureTime(b)-fixtureTime(a)).slice(0,6);const match=f=><article className="live-match section" key={f.id}><MatchBoard fixture={f} teams={d.teams} leagues={d.leagues} featured={f.status==='live'}/></article>;return <><Refresh/><div className="page-heading"><div><h1>Live matches</h1><p>Follow the campus action.</p></div><Link className="button secondary" href="/student/fixtures?status=scheduled">Predict upcoming matches</Link></div><section><h2>On the field</h2>{live.length?live.map(match):<EmptyState title="No matches live right now">Find the next match on Fixtures.</EmptyState>}</section><section className="section"><h2>Final whistle</h2>{recent.length?recent.map(match):<EmptyState title="No results yet">Final results appear here.</EmptyState>}</section></>;}
