"use client";

import { BarChart3, Users, BookOpen, GraduationCap, Trophy, FileText } from "lucide-react";
import Card from "@/components/ui/Card";
import StatsCard from "@/components/charts/StatsCard";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Laporan Sistem</h1>
      <p className="text-sm text-[var(--text-muted)]">Overview statistik platform Tirtanexa</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatsCard title="Total Pengguna" value="—" subtitle="Siswa, Guru, Admin" icon={Users} gradient="teal" delay={0}/>
        <StatsCard title="Total Soal" value="—" subtitle="Di seluruh mata pelajaran" icon={BookOpen} gradient="teal-dark" delay={0.1}/>
        <StatsCard title="Total Ujian" value="—" subtitle="Ujian diselesaikan" icon={GraduationCap} gradient="orange" delay={0.2}/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[var(--teal-50)]"><FileText size={20} className="text-[var(--teal)]"/></div>
            <h3 className="text-base font-semibold text-[var(--text)]">Ujian per Jenis</h3>
          </div>
          <div className="space-y-3">
            {[{l:"Latihan",c:"teal"},{l:"Tryout UTBK",c:"orange"},{l:"Turnamen",c:"info"}].map((t) => (
              <div key={t.l} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">{t.l}</span>
                <span className="text-sm font-semibold text-[var(--text)]">—</span>
              </div>
            ))}
          </div>
        </Card>
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[var(--orange-50)]"><Trophy size={20} className="text-[var(--orange)]"/></div>
            <h3 className="text-base font-semibold text-[var(--text)]">Turnamen Aktif</h3>
          </div>
          <div className="space-y-3">
            {[{l:"Menunggu",c:"warning"},{l:"Berlangsung",c:"teal"},{l:"Selesai",c:"success"}].map((t) => (
              <div key={t.l} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">{t.l}</span>
                <span className="text-sm font-semibold text-[var(--text)]">—</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
