"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Trophy, Users, Clock, Crown } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { Tournament, TournamentParticipant } from "@/lib/types";
import toast from "react-hot-toast";

export default function TournamentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [leaderboard, setLeaderboard] = useState<TournamentParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.tournaments.getDetail(id),
      api.tournaments.getLeaderboard(id).catch(() => []),
    ]).then(([t, lb]) => {
      setTournament(t);
      setLeaderboard(Array.isArray(lb) ? lb : []);
    }).catch(() => toast.error("Gagal memuat")).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-[var(--teal)] border-t-transparent rounded-full animate-spin"/></div>;
  if (!tournament) return <Card padding="lg" className="text-center py-16"><p className="text-[var(--text-muted)]">Turnamen tidak ditemukan</p></Card>;

  const statusMap = { WAITING: { l: "Menunggu", v: "warning" as const }, STARTING: { l: "Dimulai", v: "info" as const }, IN_PROGRESS: { l: "Berlangsung", v: "teal" as const }, FINISHED: { l: "Selesai", v: "success" as const } };
  const s = statusMap[tournament.status];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card padding="lg" className="gradient-teal text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5"/>
        <div className="relative z-10">
          <Badge variant="default" className="!bg-white/20 !text-white mb-3">{s.l}</Badge>
          <h1 className="text-2xl font-bold mb-1">{tournament.title}</h1>
          {tournament.description && <p className="text-sm text-white/70">{tournament.description}</p>}
          <div className="flex items-center gap-4 mt-4 text-sm text-white/80">
            <span className="flex items-center gap-1"><Users size={16}/> {tournament._count?.participants || 0}/{tournament.maxParticipants}</span>
            <span className="flex items-center gap-1"><Clock size={16}/> {tournament.timeLimit} menit</span>
            <span className="flex items-center gap-1">Kode: <strong>{tournament.code}</strong></span>
          </div>
        </div>
      </Card>

      {/* Leaderboard */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-2">
          <Crown size={18} className="text-[var(--orange)]"/>
          <h3 className="text-base font-semibold text-[var(--text)]">Leaderboard</h3>
        </div>
        {leaderboard.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {leaderboard.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-[var(--bg)] text-[var(--text-muted)]"}`}>{i+1}</span>
                <div className="flex-1"><p className="text-sm font-medium text-[var(--text)]">{p.user?.fullName || "Peserta"}</p></div>
                <p className="text-sm font-bold text-[var(--teal)]">{Math.round(p.score)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-sm text-[var(--text-muted)]">Belum ada data leaderboard</div>
        )}
      </Card>
    </div>
  );
}
