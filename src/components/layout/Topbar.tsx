"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

interface TopbarProps {
  title?: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const { user } = useAuthStore();

  return (
    <header
      className="
        sticky top-0 z-30
        h-[68px] bg-[var(--surface)]/80 backdrop-blur-md
        border-b border-[var(--border)]
        flex items-center justify-between px-6
      "
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors lg:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {title && (
          <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            placeholder="Cari..."
            className="
              w-56 pl-9 pr-4 py-2 rounded-[var(--radius-md)]
              bg-[var(--bg)] border border-transparent
              text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]
              focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent focus:bg-[var(--surface)]
              transition-all duration-200
            "
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--orange)]" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[var(--border)]">
          <div className="w-8 h-8 rounded-full bg-[var(--teal-50)] flex items-center justify-center text-[var(--teal)] font-semibold text-sm">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[var(--text)] leading-tight">
              {user?.fullName || "User"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
