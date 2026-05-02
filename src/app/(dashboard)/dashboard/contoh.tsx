import React from "react";
// Import komponen Sidebar dan Topbar Anda di sini
// import Sidebar from "@/components/Sidebar";
// import Topbar from "@/components/Topbar";

export default function DashboardGlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. TOPBAR (Fixed di atas) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center px-4">
        {/* <Topbar /> */}
        <div className="font-bold text-teal-600">Logo Tirtanexa</div>
      </header>

      {/* 2. SIDEBAR (Fixed di kiri, mulai dari bawah Topbar) */}
      {/* h-[calc(100vh-4rem)] artinya tinggi layar dikurangi tinggi topbar (16 = 4rem) */}
      <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 z-40 hidden md:block overflow-y-auto">
        {/* <Sidebar /> */}
        <nav className="p-4 space-y-2">
          <div>Menu 1</div>
          <div>Menu 2</div>
        </nav>
      </aside>

      {/* 3. KONTEN UTAMA */}
      {/* pt-16 (padding-top sebesar topbar), md:pl-64 (padding-left sebesar sidebar di desktop) */}
      <main className="pt-16 md:pl-64 min-h-screen">
        {/* Di sinilah page.tsx Anda akan dirender */}
        {children}
      </main>
    </div>
  );
}
