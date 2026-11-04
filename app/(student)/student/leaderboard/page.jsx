import Link from 'next/link';
import {getStudentLeaderboard, getStudentSportLeaderboard} from '@/lib/studentData';
import {SPORTS, SPORT_NAMES} from '@/lib/constants';
import {wsText} from '@/lib/sports';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
import Icon from '@/components/shared/Icon';
import PredictionBalance from '@/components/student/PredictionBalance';
import PredictionSportFilter from '@/components/student/PredictionSportFilter';

export const metadata = {title: 'Ws leaderboard'};

function RankRow({row, pinned = false}) {
  return (
    <div className={`leader-row${row.is_me ? ' my-team-row' : ''}${pinned ? ' pinned-rank' : ''}`}>
      <span className={`rank-mark${row.rank <= 3 ? ' top-rank' : ''}`}>{row.rank}</span>
      <div className="leader-details">
        <strong>{row.name}{row.is_me ? ' · You' : ''}</strong>
        <small>{row.faculty}</small>
      </div>
      <span className={`leader-ws${row.ws < 0 ? ' ws-negative' : ''}`}>{wsText(row.ws, {signed: false})}</span>
    </div>
  );
}

export default async function Leaderboard({searchParams}) {
  const query = await searchParams;
  const sport = SPORTS.includes(query?.sport) ? query.sport : '';
  const {data: rows} = await (sport ? getStudentSportLeaderboard(sport) : getStudentLeaderboard());
  const me = rows.find(row => row.is_me);
  const fixtureHref = sport ? `/student/fixtures?status=scheduled&sport=${sport}` : '/student/fixtures?status=scheduled';

  return (
    <>
      <Refresh/>
      <div className="page-heading">
        <div><h1>Ws leaderboard</h1><p>One campus. Every prediction counts.</p></div>
        <Link className="button" href={fixtureHref}>Make a prediction</Link>
      </div>
      <PredictionSportFilter path="/student/leaderboard" sport={sport}/>
      <section className="leaderboard-summary" aria-label={sport ? `${SPORT_NAMES[sport]} summary` : 'All sports summary'}>
        <PredictionBalance ws={me?.ws}/>
        <div className="ws-hero">
          <div><span>{sport ? 'Sport rank' : 'Campus rank'}</span><strong>{me?.rank ?? '—'}</strong></div>
          <div><span>Correct predictions</span><strong>{me?.correct ?? 0}<small> / {me?.predictions ?? 0}</small></strong></div>
        </div>
      </section>
      <div className="podium">
        {rows.filter(row => row.rank <= 3).slice(0, 3).map((row, index) => (
          <article className="podium-card" key={`${row.name}-${index}`}>
            <Icon name="trophy"/><span className="rank-mark">{row.rank}</span>
            <strong>{row.name}</strong><span>{wsText(row.ws, {signed: false})}</span>
          </article>
        ))}
      </div>
      {me && <RankRow row={me} pinned/>}
      <section className="section">
        <h2 className="section-title">{sport ? `${SPORT_NAMES[sport]} standings` : 'Campus standings'}</h2>
        {rows.length ? (
          <ol className="leader-list">
            {rows.map((row, index) => <li key={`${row.name}-${index}`}><RankRow row={row}/></li>)}
          </ol>
        ) : <EmptyState title="The leaderboard is ready">Students start at 0 Ws.</EmptyState>}
      </section>
    </>
  );
}
