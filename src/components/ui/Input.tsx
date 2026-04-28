"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className = "", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {label && (
          <label
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative" }}>
          {leftIcon && (
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            style={{
              width: "100%",
              padding: leftIcon ? "12px 16px 12px 44px" : isPassword ? "12px 44px 12px 16px" : "12px 16px",
              borderRadius: "10px",
              backgroundColor: "var(--bg)",
              border: error ? "1.5px solid var(--error)" : "1.5px solid var(--border, #E5E7EB)",
              fontSize: "14px",
              color: "var(--text)",
              outline: "none",
              transition: "all 0.2s",
              boxSizing: "border-box",
            }}
            className={`placeholder:text-xs ${className}`}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error ? "var(--error)" : "var(--teal)";
              e.currentTarget.style.boxShadow = error ? "0 0 0 3px rgba(239,68,68,0.15)" : "0 0 0 3px rgba(33,155,158,0.15)";
              e.currentTarget.style.backgroundColor = "#fff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? "var(--error)" : "var(--border, #E5E7EB)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.backgroundColor = "var(--bg)";
            }}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "4px",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p style={{ fontSize: "12px", color: "var(--error)", fontWeight: 500, marginTop: "6px" }}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
