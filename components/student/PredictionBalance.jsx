import Link from 'next/link';
import Icon from '@/components/shared/Icon';

export default function PredictionBalance({ws = 0, href}) {
  const balance = Number(ws ?? 0).toLocaleString('en-NG');
  const contents = (
    <>
      <span>Prediction Ws</span>
      <strong className={balance.length > 6 ? 'compact-balance' : undefined}>{balance}</strong>
      <Icon name="trophy"/>
    </>
  );

  return href ? (
    <Link className="profile-ws-circle" href={href} aria-label={`Prediction balance ${balance} Ws. View leaderboard`}>
      {contents}
    </Link>
  ) : <div className="profile-ws-circle">{contents}</div>;
}
