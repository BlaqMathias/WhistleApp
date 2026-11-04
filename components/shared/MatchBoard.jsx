import Link from 'next/link';
import Badge from './Badge';
import TeamMark from './TeamMark';
import Court from './Court';
import FixtureActions from './FixtureActions';
import LeagueMark from './LeagueMark';
import {SPORT_NAMES} from '@/lib/constants';
import {sideTeam, fixtureScore, competition} from '@/lib/sports';
import {dateTime} from '@/lib/format';
export function MatchPlayerSummary({fixture: f, teams, panel = false}) {
  const details = ['live','completed'].includes(f.status) ? f.player_details : null;
  if (!details?.man_of_the_match && !details?.goals?.length) return null;
  return <div className={panel ? 'form-panel section' : undefined}>
    {details.man_of_the_match && <p className="board-note"><strong>Man of the Match:</strong> {details.man_of_the_match.name} ({sideTeam(f,teams,details.man_of_the_match.side).name})</p>}
    {f.sport === 'football' && details.goals?.map((g,index)=><p className="board-note" key={index}><strong>Goal {index+1} · {sideTeam(f,teams,g.side).name}:</strong> {g.scorer?.name || 'Scorer not recorded'}{g.assist ? ` · Assist: ${g.assist.name}` : ''}</p>)}
  </div>;
}
export default function MatchBoard({fixture: f, teams, leagues = [], linked = false, featured = false, showPlayerDetails = false, clickable = true, showActions = true}) {
  const home = sideTeam(f, teams, 'home'), away = sideTeam(f, teams, 'away'), league=leagues.find(l=>l.id===f.league_id);
  const state = f.sport === 'volleyball' || ['cancelled', 'walkover'].includes(f.status);
  const content = <><Court sport={f.sport}/><div className="board-content">
    <div className="board-meta"><Badge status={f.status}/><span>{SPORT_NAMES[f.sport]}</span><span className="match-competition">{league&&<LeagueMark league={league}/>}{competition(f, leagues)}</span>{f.best_of && <span>Best of {f.best_of}</span>}{!linked&&showActions&&<FixtureActions fixture={f}/>}</div>
    <div className="score-line"><div className="score-team"><TeamMark name={home.name} initials={home.initials} path={home.logo}/><span>{home.name}</span></div><div className="score-number">{state ? <span className="score-state">{fixtureScore(f)}</span> : fixtureScore(f)}</div><div className="score-team"><TeamMark name={away.name} initials={away.initials} path={away.logo}/><span>{away.name}</span></div></div>
    <div className="board-footer"><span>{f.venue || 'Venue to be assigned'}</span><span>{f.started_at ? 'Started ' : ''}{dateTime(f.started_at || f.scheduled_at)}{(f.started_at || f.scheduled_at) ? ' WAT' : ''}</span></div>
    {showPlayerDetails && <MatchPlayerSummary fixture={f} teams={teams}/>}
    {f.status === 'walkover' && <p className="board-note">{sideTeam(f,teams,f.winner_side).name} won by walkover.</p>}
    {f.status === 'cancelled' && <p className="board-note">{f.cancellation_reason}</p>}
  </div></>;
  const className = `live-board${featured ? ' featured-match' : ''}`;
  return linked ? <Link className={className} href={`/fixtures/${f.id}`}>{content}</Link> : <div className={className}>{clickable&&<Link className="fixture-card-link" href={`/matches/${f.id}`} aria-label={`View ${home.name} vs ${away.name}`}/>} {content}</div>;
}
