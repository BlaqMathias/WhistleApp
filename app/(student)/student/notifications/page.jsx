import Link from 'next/link';
import {getStudentNotifications} from '@/lib/studentData';
import {dateTime} from '@/lib/format';
import Badge from '@/components/shared/Badge';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
import NotificationPreference from '@/components/student/NotificationPreference';
import MarkNotificationsRead from '@/components/student/MarkNotificationsRead';
export const metadata={title:'Notifications'};
const labels={live_score:'Live score',new_league:'New league',new_friendly:'New Friendly'};
export default async function Notifications(){const {data:d}=await getStudentNotifications();return <><Refresh/><div className="page-heading"><div><h1>Notifications</h1><p>The latest from campus sports.</p></div></div><NotificationPreference enabled={d.notifications_enabled}/><MarkNotificationsRead ids={d.notifications.filter(n=>!n.read).map(n=>n.id)}/><section className="section"><h2 className="section-title">Your updates</h2>{d.notifications.length?<ol className="notification-feed">{d.notifications.map(n=><li key={n.id} className={`message-row${n.read?'':' notification-unread'}`}><div className="message-heading"><h3>{labels[n.type]||'Campus update'}</h3><Badge status={n.read?'closed':'new'}>{n.read?'Read':'Unread'}</Badge></div><p>{n.message}</p><div className="notification-meta"><span className="help">{dateTime(n.created_at)} WAT</span><Link className="quiet-link" href={n.type==='live_score'?'/student/live':'/student/fixtures'}>View matches</Link></div></li>)}</ol>:<EmptyState title="You’re all caught up">New leagues, Friendlies and score updates appear here when notifications are on.</EmptyState>}</section></>;}
