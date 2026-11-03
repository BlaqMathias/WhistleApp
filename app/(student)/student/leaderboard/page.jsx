import Link from 'next/link';
import {getStudentLeaderboard} from '@/lib/studentData';
import {wsText} from '@/lib/sports';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
import Icon from '@/components/shared/Icon';
export const metadata = {title: 'Ws leaderboard'};
function RankRow({row: r, pinned = false}) {
  return <div className={`leader-row${r.is_me ? ' my-team-row' : ''}${pinned ? ' pinned-rank' : ''}`}><span className={`rank-mark${r.rank <= 3 ? ' top-rank' : ''}`}>{r.rank}</span><div className="leader-details"><strong>{r.name}{r.is_me ? ' · You' : ''}</strong><small>{r.faculty}</small></div><span className={`leader-ws${r.ws < 0 ? ' ws-negative' : ''}`}>{wsText(r.ws)}</span></div>;
}
export default async function Leaderboard() {
  const {data: rows} = await getStudentLeaderboard(), me = rows.find(r => r.is_me);
  return <><Refresh/><div className="page-heading"><div><h1>Ws leaderboard</h1><p>One campus. Every prediction counts.</p></div><Link className="button" href="/student/fixtures?status=scheduled">Make a prediction</Link></div>
    <section className="ws-hero"><div><span>Your balance</span><strong>{wsText(me?.ws)}</strong></div><div><span>Campus rank</span><strong>{me?.rank || '—'}</strong></div><div><span>Correct predictions</span><strong>{me?.correct || 0}<small> / {me?.predictions || 0}</small></strong></div></section>
    <div className="podium">{rows.filter(r => r.rank <= 3).slice(0,3).map((r,i) => <article className="podium-card" key={`${r.name}-${i}`}><Icon name="trophy"/><span className="rank-mark">{r.rank}</span><strong>{r.name}</strong><span>{wsText(r.ws)}</span></article>)}</div>
    {me && <RankRow row={me} pinned/>}
    <section className="section"><h2 className="section-title">Campus standings</h2>{rows.length ? <ol className="leader-list">{rows.map((r,i) => <li key={`${r.name}-${i}`}><RankRow row={r}/></li>)}</ol> : <EmptyState title="The leaderboard is ready">Students start at 0 Ws.</EmptyState>}</section>
  </>;
}
