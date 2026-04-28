"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layers, BookOpen } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { Subject } from "@/lib/types";

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.subjects.getAll().then((d) => setSubjects(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const catBadge = { UTBK: "orange" as const, SD: "success" as const, SMP: "info" as const, SMA: "teal" as const };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Mata Pelajaran</h1>
      <p className="text-sm text-[var(--text-muted)]">Kelola mata pelajaran dan bab</p>
      {loading ? <div className="space-y-3">{Array.from({length:4}).map((_,i) => <div key={i} className="h-20 rounded-xl animate-shimmer"/>)}</div> : subjects.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s, i) => (
            <motion.div key={s.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
              <Card padding="lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--teal-50)] flex items-center justify-center"><BookOpen size={20} className="text-[var(--teal)]"/></div>
                  <Badge variant={catBadge[s.category]} size="sm">{s.category}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text)] mb-0.5">{s.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">Kode: {s.code}</p>
                <p className="text-xs text-[var(--text-muted)] mt-2">{s._count?.chapters || 0} bab</p>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : <Card padding="lg" className="text-center py-16"><Layers size={48} className="mx-auto text-[var(--text-muted)] mb-4"/><p className="text-[var(--text-muted)]">Belum ada mata pelajaran</p></Card>}
    </div>
  );
}
