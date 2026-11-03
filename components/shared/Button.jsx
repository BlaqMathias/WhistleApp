export default function Button({
  variant = "",
  className = "",
  children,
  ...props
}) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
