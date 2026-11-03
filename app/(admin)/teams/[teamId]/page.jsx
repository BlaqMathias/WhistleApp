import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getData} from '@/lib/data';
import {SPORT_NAMES} from '@/lib/constants';
import TeamForm from '@/components/admin/TeamForm';
import LogoEditor from '@/components/admin/LogoEditor';
import ArchiveButton from '@/components/admin/ArchiveButton';
import TeamMark from '@/components/shared/TeamMark';
import Badge from '@/components/shared/Badge';
export default async function Team({params}){
 const {teamId}=await params,d=await getData(),t=d.teams.find(t=>t.id===teamId);if(!t)notFound();
 const ids=d.team_players.filter(p=>p.team_id===t.id).map(p=>p.student_id);
 return <><Link className="back-link" href="/teams">Back to teams</Link><div className="page-heading"><div className="team-cell"><TeamMark name={t.name} initials={t.logo_initials} path={t.logo_path}/><div><h1>{t.name}</h1><p>{SPORT_NAMES[t.sport]} / {ids.length} players</p></div></div><Badge status={t.status}/></div>{t.status==='active'?<><div className="split-panel"><TeamForm students={d.students} team={t} playerIds={ids}/><LogoEditor entity="teams" id={t.id} path={t.logo_path}/></div><ArchiveButton entity="teams" id={t.id} label="Team"/></>:<section><h2>Archived roster</h2><ul>{d.students.filter(s=>ids.includes(s.id)).map(s=><li key={s.id}>{s.name} / {s.matric_number}</li>)}</ul></section>}</>;
}
