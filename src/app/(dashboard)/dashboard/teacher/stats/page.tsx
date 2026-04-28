"use client";

import { BarChart3, Users, GraduationCap, TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import StatsCard from "@/components/charts/StatsCard";

export default function TeacherStatsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Statistik Siswa</h1>
      <p className="text-sm text-[var(--text-muted)]">Pantau performa siswa yang mengerjakan soalmu</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard title="Total Siswa" value="—" subtitle="Mengerjakan soalmu" icon={Users} gradient="teal" delay={0}/>
        <StatsCard title="Rata-rata Skor" value="—" subtitle="Dari semua ujian" icon={BarChart3} gradient="teal-dark" delay={0.1}/>
        <StatsCard title="Tingkat Kelulusan" value="—" subtitle="Skor di atas rata-rata" icon={TrendingUp} gradient="orange" delay={0.2}/>
      </div>

      <Card padding="lg" className="text-center py-16">
        <GraduationCap size={48} className="mx-auto text-[var(--text-muted)] mb-4"/>
        <p className="text-base font-medium text-[var(--text-secondary)]">Statistik detail akan tersedia segera</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">Data akan muncul setelah siswa mengerjakan soal Anda</p>
      </Card>
    </div>
  );
}
