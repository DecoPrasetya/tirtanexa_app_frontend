"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Trophy,
  History,
  Users,
  BarChart3,
  Settings,
  User,
  ChevronLeft,
  LogOut,
  PenTool,
  ClipboardList,
  Layers,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import type { Role } from "@/lib/types";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  // Shared
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["STUDENT", "TEACHER", "ADMIN"] },

  // Student
  { label: "Mata Pelajaran", href: "/dashboard/subjects", icon: BookOpen, roles: ["STUDENT"] },
  { label: "Latihan Soal", href: "/dashboard/exams/practice", icon: GraduationCap, roles: ["STUDENT"] },
  { label: "Tryout UTBK", href: "/dashboard/exams/tryout", icon: FileText, roles: ["STUDENT"] },
  { label: "Turnamen", href: "/dashboard/tournaments", icon: Trophy, roles: ["STUDENT"] },
  { label: "Riwayat", href: "/dashboard/history", icon: History, roles: ["STUDENT"] },

  // Teacher
  { label: "Bank Soal", href: "/dashboard/teacher/questions", icon: ClipboardList, roles: ["TEACHER"] },
  { label: "Buat Soal", href: "/dashboard/teacher/questions/create", icon: PenTool, roles: ["TEACHER"] },
  { label: "Turnamen", href: "/dashboard/teacher/tournaments", icon: Trophy, roles: ["TEACHER"] },
  { label: "Statistik Siswa", href: "/dashboard/teacher/stats", icon: BarChart3, roles: ["TEACHER"] },

  // Admin
  { label: "Manajemen User", href: "/dashboard/admin/users", icon: Users, roles: ["ADMIN"] },
  { label: "Bank Soal", href: "/dashboard/admin/questions", icon: ClipboardList, roles: ["ADMIN"] },
  { label: "Mata Pelajaran", href: "/dashboard/admin/subjects", icon: Layers, roles: ["ADMIN"] },
  { label: "Turnamen", href: "/dashboard/admin/tournaments", icon: Trophy, roles: ["ADMIN"] },
  { label: "Laporan Sistem", href: "/dashboard/admin/reports", icon: BarChart3, roles: ["ADMIN"] },

  // Profile (all)
  { label: "Profil", href: "/dashboard/profile", icon: User, roles: ["STUDENT", "TEACHER", "ADMIN"] },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const role = user?.role || "STUDENT";

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 270 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="
        fixed left-0 top-0 bottom-0 z-40
        bg-[var(--surface)] border-r border-[var(--border)]
        flex flex-col
        shadow-[var(--shadow-sm)]
      "
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-[68px] px-4 border-b border-[var(--border)]">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
              <div>
                <h1 className="text-base font-bold text-[var(--text)] tracking-tight leading-none">
                  Tirtanexa
                </h1>
                <p className="text-[10px] text-[var(--text-muted)] font-medium">
                  Learning Platform
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {isCollapsed && (
          <div className="w-9 h-9 mx-auto rounded-xl gradient-teal flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors cursor-pointer hidden lg:flex"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={18} />
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="flex flex-col gap-1">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-[var(--teal-50)] text-[var(--teal)] font-semibold"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
                    }
                    ${isCollapsed ? "justify-center px-0" : ""}
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    size={20}
                    className={`flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-[var(--teal)]"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                    }`}
                  />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-[3px] h-8 rounded-r-full bg-[var(--teal)]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-[var(--border)] p-3">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-[var(--teal-50)] flex items-center justify-center text-[var(--teal)] font-semibold text-sm flex-shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text)] truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full flex justify-center p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-colors cursor-pointer"
            title="Keluar"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
