import Link from 'next/link';
import {getStudentPredictionHistory} from '@/lib/studentData';
import {SPORTS, SPORT_NAMES} from '@/lib/constants';
import {sideTeam, wsText} from '@/lib/sports';
import {dateTime} from '@/lib/format';
import FixtureCard from '@/components/shared/FixtureCard';
import EmptyState from '@/components/shared/EmptyState';
import Refresh from '@/components/shared/Refresh';
import PredictionSportFilter from '@/components/student/PredictionSportFilter';

export const metadata = {title: 'Prediction history'};

export default async function Predictions({searchParams}) {
  const query = await searchParams;
  const sport = SPORTS.includes(query?.sport) ? query.sport : '';
  const {data} = await getStudentPredictionHistory();
  const entries = sport ? data.entries.filter(entry => entry.fixture.sport === sport) : data.entries;

  return (
    <>
      <Refresh/>
      <div className="page-heading">
        <h1>Prediction history</h1>
        <Link className="quiet-link" href={sport ? `/student/fixtures?sport=${sport}` : '/student/fixtures'}>Find a match</Link>
      </div>
      <PredictionSportFilter path="/student/predictions" sport={sport}/>
      {entries.length ? (
        <div className="fixture-stack">
          {entries.map(entry => {
            const fixture = entry.fixture;
            const side = entry.choice === 'win_home' ? 'home' : 'away';
            const pick = entry.choice === 'draw' ? 'Draw' : `${sideTeam(fixture, data.teams, side).name} win`;
            const result = entry.poll_status === 'void' ? 'Void' : entry.ws != null ? wsText(entry.ws) : 'Pending';

            return (
              <FixtureCard key={fixture.id} fixture={fixture} teams={data.teams} leagues={data.leagues}>
                <div className="prediction-history-result">
                  <div><span>Your pick: {pick}</span><small>{dateTime(entry.predicted_at)} WAT</small></div>
                  <strong>{result}</strong>
                </div>
              </FixtureCard>
            );
          })}
        </div>
      ) : (
        <EmptyState title={sport ? `No ${SPORT_NAMES[sport].toLowerCase()} predictions yet` : 'No predictions yet'}>
          Choose a match and make your first pick.
        </EmptyState>
      )}
    </>
  );
}
