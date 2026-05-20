"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Users, Clock } from "lucide-react";
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Turnamen</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Berkompetisi dengan siswa lain secara realtime</p>
      </div>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {[
          { icon: Users, title: "Kompetisi Realtime", desc: "Bersaing langsung dengan peserta lain", bg: '#f0fdfa', iconColor: '#0d9488', borderColor: '#ccfbf1' },
          { icon: Clock, title: "Waktu Terbatas", desc: "Kerjakan soal dalam waktu yang ditentukan", bg: '#fffbeb', iconColor: '#d97706', borderColor: '#fef3c7' },
          { icon: Trophy, title: "Leaderboard", desc: "Lihat peringkatmu secara langsung", bg: '#eef2ff', iconColor: '#4f46e5', borderColor: '#e0e7ff' },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                border: `1px solid ${item.borderColor}`,
                padding: '24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: item.bg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <item.icon size={24} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px', margin: 0 }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Join by code */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
          padding: '24px',
          maxWidth: '512px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Trophy size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0, lineHeight: 1.2 }}>Gabung Turnamen</h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.2 }}>Masukkan kode dari guru atau penyelenggara</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            placeholder="Kode turnamen (contoh: ABC123)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              fontSize: '14px',
              outline: 'none',
              color: '#1e293b',
              backgroundColor: '#f8fafc',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0d9488'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          <button
            disabled={joining}
            onClick={handleJoin}
            style={{
              flexShrink: 0,
              backgroundColor: '#0d9488',
              color: 'white',
              padding: '0 24px',
              borderRadius: '12px',
              fontWeight: 'bold',
              border: 'none',
              cursor: joining ? 'not-allowed' : 'pointer',
              opacity: joining ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s, background-color 0.2s',
              fontSize: '14px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
          >
            {joining ? 'Memproses...' : 'Gabung'}
          </button>
        </div>
      </div>
    </div>
  );
}
