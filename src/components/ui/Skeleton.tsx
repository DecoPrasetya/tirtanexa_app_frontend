export default function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-shimmer rounded-[var(--radius-md)] ${className}`}
      {...props}
    />
  );
}
