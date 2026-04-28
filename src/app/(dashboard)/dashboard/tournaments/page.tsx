"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Search, ArrowRight, Users, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function TournamentsPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) { toast.error("Masukkan kode turnamen"); return; }
    setJoining(true);
    try {
      const p = await api.tournaments.join(code.trim().toUpperCase());
      toast.success("Berhasil bergabung!");
      router.push(`/dashboard/tournaments/${p.tournamentId}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal bergabung");
    } finally { setJoining(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Turnamen</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Berkompetisi dengan siswa lain secara realtime</p>
      </div>

      {/* Join by code */}
      <Card padding="lg" className="max-w-lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl gradient-teal text-white"><Trophy size={20}/></div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text)]">Gabung Turnamen</h2>
            <p className="text-xs text-[var(--text-muted)]">Masukkan kode dari guru atau penyelenggara</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Input placeholder="Kode turnamen (contoh: ABC123)" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}/>
          <Button isLoading={joining} onClick={handleJoin} className="flex-shrink-0">Gabung</Button>
        </div>
      </Card>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Users, title: "Kompetisi Realtime", desc: "Bersaing langsung dengan peserta lain", color: "teal" },
          { icon: Clock, title: "Waktu Terbatas", desc: "Kerjakan soal dalam waktu yang ditentukan", color: "orange" },
          { icon: Trophy, title: "Leaderboard", desc: "Lihat peringkatmu secara langsung", color: "teal" },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
            <Card padding="lg" className="h-full">
              <div className={`w-10 h-10 rounded-xl ${item.color === "teal" ? "bg-[var(--teal-50)]" : "bg-[var(--orange-50)]"} flex items-center justify-center mb-3`}>
                <item.icon size={20} className={item.color === "teal" ? "text-[var(--teal)]" : "text-[var(--orange)]"}/>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)] mb-1">{item.title}</h3>
              <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
