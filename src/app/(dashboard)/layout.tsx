"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, PenTool, ClipboardList, Trophy, 
  TrendingUp, BarChart2, Users, User, X, Menu, Search, Bell, LogOut, PenSquare
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import "./dashboard.css"; // Import the CSS globally for dashboard routes
import type { Role } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
  badge?: string;
  section?: string;
}

const navItems: NavItem[] = [
  // Shared
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["STUDENT", "TEACHER", "ADMIN"], section: "Menu Utama" },

  // Student
  { label: "Mata Pelajaran", href: "/dashboard/subjects", icon: BookOpen, roles: ["STUDENT"], section: "Menu Utama" },
  { label: "Latihan Soal", href: "/dashboard/exams/practice", icon: PenTool, roles: ["STUDENT"], section: "Menu Utama" },
  { label: "Tryout UTBK", href: "/dashboard/exams/tryout", icon: ClipboardList, roles: ["STUDENT"], badge: "Live", section: "Menu Utama" },
  { label: "Turnamen", href: "/dashboard/tournaments", icon: Trophy, roles: ["STUDENT"], section: "Komunitas" },
  { label: "Riwayat", href: "/dashboard/history", icon: TrendingUp, roles: ["STUDENT"], section: "Komunitas" },

  // Teacher
  { label: "Bank Soal", href: "/dashboard/teacher/questions", icon: ClipboardList, roles: ["TEACHER"], section: "Akademik" },
  { label: "Buat Soal", href: "/dashboard/teacher/questions/create", icon: PenSquare, roles: ["TEACHER"], section: "Akademik" },
  { label: "Turnamen", href: "/dashboard/teacher/tournaments", icon: Trophy, roles: ["TEACHER"], section: "Komunitas" },
  { label: "Statistik Siswa", href: "/dashboard/teacher/stats", icon: BarChart2, roles: ["TEACHER"], section: "Komunitas" },

  // Admin
  { label: "Manajemen User", href: "/dashboard/admin/users", icon: Users, roles: ["ADMIN"], section: "Sistem" },
  { label: "Bank Soal", href: "/dashboard/admin/questions", icon: ClipboardList, roles: ["ADMIN"], section: "Sistem" },
  { label: "Mata Pelajaran", href: "/dashboard/admin/subjects", icon: BookOpen, roles: ["ADMIN"], section: "Sistem" },
  { label: "Turnamen", href: "/dashboard/admin/tournaments", icon: Trophy, roles: ["ADMIN"], section: "Sistem" },
  { label: "Laporan Sistem", href: "/dashboard/admin/reports", icon: BarChart2, roles: ["ADMIN"], section: "Sistem" },

  // Profile (all)
  { label: "Profil", href: "/dashboard/profile", icon: User, roles: ["STUDENT", "TEACHER", "ADMIN"], section: "Lainnya" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized, initialize, logout } = useAuthStore();
  const [sbOpen, setSbOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const role = user?.role || "STUDENT";

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login");
    }
  }, [isInitialized, user, router]);

  // Close sidebar on navigation change
  useEffect(() => {
    setSbOpen(false);
  }, [pathname]);

  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        {/* Loading Spinner */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d8a8e] to-[#2dd4bf] flex items-center justify-center text-white font-bold text-xl animate-pulse">T</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse [animation-delay:150ms]" />
            <div className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse [animation-delay:300ms]" />
          </div>
          <p className="text-sm text-[#9ca3af]">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const closeSb = () => setSbOpen(false);
  const doLogout = () => { logout(); router.push("/login"); };

  const dpName = user?.fullName || "User";
  const dpInitials = dpName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  // Helper to determine active menu
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true;
    if (path !== "/dashboard" && pathname.startsWith(path)) return true;
    return false;
  };

  const filteredItems = navItems.filter((item) => item.roles.includes(role));
  
  // Group items by section to render labels
  const sections: { [key: string]: NavItem[] } = {};
  filteredItems.forEach(item => {
    const sec = item.section || "Lainnya";
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(item);
  });

  return (
    <div className="dashboard-wrapper">
      {/* SEARCH POPUP (Mobile) */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[999] bg-slate-900/70 backdrop-blur-sm flex justify-start p-4 pt-20 flex-col items-center lg:hidden animate-fade-in"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="relative w-full max-w-lg h-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Cari soal, materi..."
                className="w-full pl-14 pr-6 py-4 rounded-full bg-white text-slate-800 text-base font-medium placeholder:text-slate-400 border-2 border-transparent focus:border-teal-500 focus:outline-none shadow-2xl transition-colors"
                autoFocus
              />
            </div>
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            className="mt-8 text-white/80 font-semibold text-sm bg-white/10 px-5 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            Tutup Pencarian
          </button>
        </div>
      )}

      {/* OVERLAY */}
      <div className={`overlay ${sbOpen ? "on" : ""}`} onClick={closeSb}></div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sbOpen ? "on" : ""}`}>
        <div className="sb-logo">
          <div className="lmark">T</div>
          <div className="ltxt"><strong>Tirtanexa</strong><span>Learning Platform</span></div>
          <button className="sb-x" onClick={closeSb}><X size={20} /></button>
        </div>
        <nav className="sb-nav">
          {Object.entries(sections).map(([sectionName, items]) => (
            <div key={sectionName}>
              <div className="nlabel">{sectionName}</div>
              {items.map(item => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`nitem ${isActive(item.href) ? "on" : ""}`}
                  onClick={closeSb}
                >
                  <span className="nico"><item.icon size={20} /></span> {item.label}
                  {item.badge && <span className="nbadge">{item.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sb-foot">
          <div className="uav">{dpInitials}</div>
          <div><span className="uname">{dpName}</span><span className="ubadge capitalize">{role.toLowerCase()}</span></div>
          <button className="uout flex items-center justify-center text-[var(--text-muted)] hover:text-red-500" onClick={doLogout}><LogOut size={20} /></button>
        </div>
      </aside>

      {/* MAIN WRAP */}
      <div className="mainwrap flex flex-col h-screen overflow-hidden">
        {/* Mobile topbar */}
        <header className="topbar sticky top-0 z-50 bg-white shadow-sm shrink-0 lg:hidden flex items-center">
          <button className="ham flex items-center justify-center" onClick={() => setSbOpen(true)}><Menu size={24} /></button>
          <div className="tbar-brand">
            <div className="lmark">T</div>
            <span>Tirtanexa</span>
          </div>
          <div className="tbar-r flex items-center">
            <button className="icobtn flex items-center justify-center" onClick={() => setSearchOpen(true)}><Search size={20} /></button>
            <button className="icobtn flex items-center justify-center"><Bell size={20} /></button>
            <div className="tav">{dpInitials}</div>
          </div>
        </header>

        {/* Desktop topbar */}
        <div className="dtopbar hidden lg:flex sticky top-0 z-50 bg-[#f5f7fa]/95 backdrop-blur-md shrink-0 py-3 border-b border-slate-200/50">
          <span className="dtitle">Dashboard</span>
          <div className="dsearch"><span style={{color:"var(--gray-400)"}}><Search size={16} /></span><input placeholder="Cari soal, materi..." /></div>
          <div style={{display:"flex", gap:"8px", alignItems:"center"}}>
            <button className="icobtn flex items-center justify-center"><Bell size={20} /></button>
            <div className="tav">{dpInitials}</div>
          </div>
        </div>

        {/* PAGE */}
        <main className="page flex-1 overflow-y-auto relative">
          {children}
        </main>

        {/* BOTTOM NAV */}
        <nav className="bnav shrink-0 z-50 bg-white">
          <div className="bninner">
            {filteredItems.slice(0, 5).map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`bnitem ${isActive(item.href) ? "on" : ""}`}
              >
                <div className="bniw flex items-center justify-center"><item.icon size={20} /></div>
                <span>{item.label.split(" ")[0]}</span>
                {item.badge && <div className="bndot"></div>}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
