"use client";

import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white shadow-sm hover:shadow-md",
  secondary:
    "bg-transparent border-2 border-[var(--border)] hover:border-[var(--teal)] text-[var(--text)] hover:text-[var(--teal)]",
  accent:
    "bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white shadow-sm hover:shadow-md",
  ghost:
    "bg-transparent hover:bg-[var(--teal-50)] text-[var(--text-secondary)] hover:text-[var(--teal)]",
  danger:
    "bg-[var(--error)] hover:bg-red-600 text-white shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs gap-1.5 rounded-lg",
  md: "px-6 py-3 text-sm gap-2 rounded-xl",
  lg: "px-8 py-5 text-base gap-3 rounded-[14px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center font-semibold
          transition-all duration-200 ease-out
          focus-ring cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          active:scale-[0.97]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
