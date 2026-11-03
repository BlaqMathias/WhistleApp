export default function Skeleton({title = "Loading campus sports"}) {
  return <div className="skeleton-stack" role="status"><span className="sr-only">{title}</span><div className="skeleton skeleton-title"/><div className="skeleton skeleton-hero"/><div className="quick-grid">{[0,1,2].map(i => <div className="skeleton skeleton-tile" key={i}/>)}</div><div className="skeleton skeleton-match"/><div className="skeleton skeleton-match"/></div>;
}
