import Icon from "./Icon";
export default function EmptyState({title, children}) {
  return <div className="empty-state"><span className="empty-mark"><Icon name="whistle"/></span><h3>{title}</h3>{children && <p>{children}</p>}</div>;
}
