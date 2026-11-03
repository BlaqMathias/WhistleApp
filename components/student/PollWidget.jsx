'use client';
import Link from 'next/link';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
import {sideTeam,outcome,wsText} from '@/lib/sports';
import {matchHref} from '@/lib/account';
export default function PollWidget({fixture,teams,poll,publicView=false,adminView=false}) {
 const m=useMutation();
 if(!poll) return null;
 const open=poll.can_vote&&fixture.status==='scheduled';
 const choices=[['win_home',`${sideTeam(fixture,teams,'home').name} win`],...(fixture.sport==='volleyball'?[]:[['draw','Draw']]),['win_away',`${sideTeam(fixture,teams,'away').name} win`]];
 return <section className="poll-panel" aria-label="Match predictions"><div className="section-header"><h3>Who takes the win?</h3><Badge status={poll.status}/></div>
  {!open&&<p className="help">{poll.status==='void'?'Predictions void.':outcome(fixture,teams)}</p>}
  {open&&(adminView?<p className="help">Voting is open to students.</p>:publicView?<p className="section"><Link className="button secondary" href={`/login?next=${encodeURIComponent(matchHref(fixture.id))}`}>Sign in to predict</Link></p>:<div className="poll-choices" role="group" aria-label="Predict match outcome">{choices.map(([choice,label])=><Button key={choice} variant="secondary" aria-label={label} aria-pressed={poll.my_choice===choice} disabled={m.pending} onClick={()=>m.run(()=>send(`/api/polls/${fixture.id}/vote`,{choice}),'Prediction saved.')}>{choice==='win_home'?'Home':choice==='win_away'?'Away':'Draw'}</Button>)}</div>)}
  <div className="poll-tally">{choices.map(([choice,label])=>{const votes=poll.tally[choice]||0,percentage=poll.total?Math.round(votes*100/poll.total):0;return <div key={choice}><div className="poll-tally-label"><span>{label}{poll.my_choice===choice&&<strong className="poll-my-choice">Your pick</strong>}</span><span>{votes} {votes===1?'vote':'votes'} / {percentage}%</span></div><progress value={votes} max={poll.total||1} className="progress-line" aria-label={`${label}: ${votes} votes`}/></div>;})}</div>
  {poll.my_ws!=null&&<p className={`ws-award ${poll.my_ws>0?'positive':'negative'}`}>{wsText(poll.my_ws)} from this prediction</p>}
  <FormStatus {...m}/>
 </section>;
}
