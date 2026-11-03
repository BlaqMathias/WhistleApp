import Link from 'next/link';
import {getStudentProfile} from '@/lib/studentData';
import {SPORT_NAMES} from '@/lib/constants';
import {wsText} from '@/lib/sports';
import TeamMark from '@/components/shared/TeamMark';
import Badge from '@/components/shared/Badge';
import NotificationPreference from '@/components/student/NotificationPreference';
import Refresh from '@/components/shared/Refresh';
import ThemeToggle from '@/components/shared/ThemeToggle';
import Icon from '@/components/shared/Icon';
import EmptyState from '@/components/shared/EmptyState';
export const metadata={title:'Profile'};
export default async function Profile(){const {data:d}=await getStudentProfile(),p=d.profile;return <><Refresh/><div className="page-heading"><div><h1>Profile</h1><p>Your campus details and team memberships.</p></div><Link className="ws-balance" href="/student/leaderboard"><span>Your balance</span><strong>{wsText(d.prediction?.ws)}</strong></Link></div><div className="split-panel"><section className="form-panel"><h2>Student details</h2><dl className="meta-grid">{[['Full name',p.name],['Matric number',p.matric_number],['Faculty',p.faculty],['University email',p.email]].map(([label,value])=><div key={label}><dt>{label}</dt><dd className="profile-email">{value}</dd></div>)}</dl></section><NotificationPreference enabled={p.notifications_enabled}/></div>{['active','archived'].map(status=><section className="section" key={status}><h2 className="section-title">{status==='active'?'Your teams':'Archived memberships'}</h2>{d.teams.some(t=>t.status===status)?<div className="student-teams">{d.teams.filter(t=>t.status===status).map(t=><div className="student-team" key={t.id}><TeamMark name={t.name} initials={t.logo_initials} path={t.logo_path}/><div><strong>{t.name}</strong><span className="table-sub">{SPORT_NAMES[t.sport]}</span></div><Badge status={t.status}/></div>)}</div>:<EmptyState title={status==='active'?'No active team memberships':'No archived memberships'}>Your roster memberships appear here when the admin adds you.</EmptyState>}</section>)}<section className="section form-panel form-stack"><div><h2>Appearance</h2><p className="help">Choose your matchday look.</p></div><ThemeToggle segmented/></section><div className="profile-links section"><Link className="profile-link" href="/student/leaderboard"><Icon name="trophy"/>Ws leaderboard<Icon name="chevron-right"/></Link><Link className="profile-link" href="/student/notifications"><Icon name="bell"/>Notifications<Icon name="chevron-right"/></Link><Link className="profile-link" href="/student/feedback"><Icon name="whistle"/>Share feedback<Icon name="chevron-right"/></Link></div><form className="section" action="/api/auth/logout" method="post"><button className="sign-out" type="submit">Sign out</button></form></>;}

