"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import "./dashboard.css"; // Import the CSS globally for dashboard routes
import type { Role } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Role[];
  badge?: string;
  section?: string;
}

const navItems: NavItem[] = [
  // Shared
  { label: "Dashboard", href: "/dashboard", icon: "⊞", roles: ["STUDENT", "TEACHER", "ADMIN"], section: "Menu Utama" },

  // Student
  { label: "Mata Pelajaran", href: "/dashboard/subjects", icon: "📚", roles: ["STUDENT"], section: "Menu Utama" },
  { label: "Latihan Soal", href: "/dashboard/exams/practice", icon: "✏️", roles: ["STUDENT"], section: "Menu Utama" },
  { label: "Tryout UTBK", href: "/dashboard/exams/tryout", icon: "📝", roles: ["STUDENT"], badge: "Live", section: "Menu Utama" },
  { label: "Turnamen", href: "/dashboard/tournaments", icon: "🏆", roles: ["STUDENT"], section: "Komunitas" },
  { label: "Riwayat", href: "/dashboard/history", icon: "📈", roles: ["STUDENT"], section: "Komunitas" },

  // Teacher
  { label: "Bank Soal", href: "/dashboard/teacher/questions", icon: "📋", roles: ["TEACHER"], section: "Akademik" },
  { label: "Buat Soal", href: "/dashboard/teacher/questions/create", icon: "✍️", roles: ["TEACHER"], section: "Akademik" },
  { label: "Turnamen", href: "/dashboard/teacher/tournaments", icon: "🏆", roles: ["TEACHER"], section: "Komunitas" },
  { label: "Statistik Siswa", href: "/dashboard/teacher/stats", icon: "📊", roles: ["TEACHER"], section: "Komunitas" },

  // Admin
  { label: "Manajemen User", href: "/dashboard/admin/users", icon: "👥", roles: ["ADMIN"], section: "Sistem" },
  { label: "Bank Soal", href: "/dashboard/admin/questions", icon: "📋", roles: ["ADMIN"], section: "Sistem" },
  { label: "Mata Pelajaran", href: "/dashboard/admin/subjects", icon: "📚", roles: ["ADMIN"], section: "Sistem" },
  { label: "Turnamen", href: "/dashboard/admin/tournaments", icon: "🏆", roles: ["ADMIN"], section: "Sistem" },
  { label: "Laporan Sistem", href: "/dashboard/admin/reports", icon: "📊", roles: ["ADMIN"], section: "Sistem" },

  // Profile (all)
  { label: "Profil", href: "/dashboard/profile", icon: "👤", roles: ["STUDENT", "TEACHER", "ADMIN"], section: "Lainnya" },
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
      {/* OVERLAY */}
      <div className={`overlay ${sbOpen ? "on" : ""}`} onClick={closeSb}></div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sbOpen ? "on" : ""}`}>
        <div className="sb-logo">
          <div className="lmark">T</div>
          <div className="ltxt"><strong>Tirtanexa</strong><span>Learning Platform</span></div>
          <button className="sb-x" onClick={closeSb}>✕</button>
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
                  <span className="nico">{item.icon}</span> {item.label}
                  {item.badge && <span className="nbadge">{item.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sb-foot">
          <div className="uav">{dpInitials}</div>
          <div><span className="uname">{dpName}</span><span className="ubadge capitalize">{role.toLowerCase()}</span></div>
          <button className="uout" onClick={doLogout}>⇥</button>
        </div>
      </aside>

      {/* MAIN WRAP */}
      <div className="mainwrap flex flex-col h-screen overflow-hidden">
        {/* Mobile topbar */}
        <header className="topbar sticky top-0 z-50 bg-white shadow-sm shrink-0">
          <button className="ham" onClick={() => setSbOpen(true)}>☰</button>
          <div className="tbar-brand">
            <div className="lmark">T</div>
            <span>Tirtanexa</span>
          </div>
          <div className="tbar-r">
            <button className="icobtn">🔔</button>
            <div className="tav">{dpInitials}</div>
          </div>
        </header>

        {/* Desktop topbar */}
        <div className="dtopbar sticky top-0 z-50 bg-[#f5f7fa]/95 backdrop-blur-md shrink-0 py-3 border-b border-slate-200/50">
          <span className="dtitle">Dashboard</span>
          <div className="dsearch"><span style={{color:"var(--gray-400)", fontSize:"13px"}}>🔍</span><input placeholder="Cari soal, materi..." /></div>
          <div style={{display:"flex", gap:"8px", alignItems:"center"}}>
            <button className="icobtn">🔔</button>
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
                <div className="bniw">{item.icon}</div>
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
