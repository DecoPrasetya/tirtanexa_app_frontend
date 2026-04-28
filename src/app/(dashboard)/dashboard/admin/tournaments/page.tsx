"use client";

import { Trophy } from "lucide-react";
import Card from "@/components/ui/Card";

export default function AdminTournamentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Manajemen Turnamen</h1>
      <p className="text-sm text-[var(--text-muted)]">Kelola semua turnamen di platform</p>
      <Card padding="lg" className="text-center py-16">
        <Trophy size={48} className="mx-auto text-[var(--text-muted)] mb-4"/>
        <p className="text-base font-medium text-[var(--text-secondary)]">Manajemen turnamen admin</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">Fitur pengelolaan turnamen lengkap akan segera hadir</p>
      </Card>
    </div>
  );
}
