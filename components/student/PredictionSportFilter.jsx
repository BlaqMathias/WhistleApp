import Link from 'next/link';
import {SPORTS, SPORT_NAMES} from '@/lib/constants';

export default function PredictionSportFilter({path, sport}) {
  return (
    <nav className="prediction-sport-filter" aria-label="Filter predictions by sport">
      {['', ...SPORTS].map(option => (
        <Link
          key={option}
          className="chip"
          href={option ? `${path}?sport=${option}` : path}
          aria-current={sport === option ? 'page' : undefined}
        >
          {SPORT_NAMES[option] || 'All sports'}
        </Link>
      ))}
    </nav>
  );
}
