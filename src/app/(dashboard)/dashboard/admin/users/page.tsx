"use client";

import { Users, Search, Shield } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Manajemen User</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Kelola pengguna platform</p>
        </div>
      </div>

      <div className="max-w-sm">
        <Input placeholder="Cari user..." leftIcon={<Search size={18}/>}/>
      </div>

      <Card padding="lg" className="text-center py-16">
        <Users size={48} className="mx-auto text-[var(--text-muted)] mb-4"/>
        <p className="text-base font-medium text-[var(--text-secondary)]">Manajemen user memerlukan endpoint backend</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">Endpoint admin akan ditambahkan di iterasi berikutnya</p>
      </Card>
    </div>
  );
}
