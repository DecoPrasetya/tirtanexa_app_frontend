import { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", padding = "md", className = "", children, ...props }, ref) => {
    const base =
      "bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] transition-all duration-200";
    const variants = {
      default: "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
      interactive:
        "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 cursor-pointer",
      glass:
        "glass",
    };

    return (
      <div
        ref={ref}
        className={`${base} ${variants[variant]} ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
