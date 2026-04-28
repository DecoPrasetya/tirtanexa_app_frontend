interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "teal" | "orange" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  default: "bg-[var(--bg-alt)] text-[var(--text-secondary)]",
  teal: "bg-[var(--teal-50)] text-[var(--teal-dark)]",
  orange: "bg-[var(--orange-50)] text-[var(--orange)]",
  success: "bg-[var(--success-bg)] text-emerald-700",
  warning: "bg-[var(--warning-bg)] text-amber-700",
  error: "bg-[var(--error-bg)] text-red-700",
  info: "bg-[var(--info-bg)] text-blue-700",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full whitespace-nowrap
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
