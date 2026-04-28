"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import type { ExamSession } from "@/lib/types";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [chartMode, setChartMode] = useState<"skor" | "persen">("skor");
  const [activePill, setActivePill] = useState("semua");
  const [mounted, setMounted] = useState(false);

  const [history, setHistory] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const hist = await api.exams.getHistory();
        setHistory(Array.isArray(hist) ? hist : []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const dpName = user?.fullName || "Student";
  const dpInitials = dpName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  // ── Derived Stats ──
  const totalExams = history.length;
  const avgScore = totalExams > 0 
    ? Math.round(history.reduce((acc, e) => acc + (e.irtScore || 0), 0) / totalExams)
    : 0;

  // Recent 5 exams
  const recentExams = [...history].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, 5);

  // Line Chart Data
  const chartData = useMemo(() => {
    if (history.length === 0) return [];
    // Sort oldest to newest
    const sorted = [...history].sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
    return sorted.slice(-8).map((exam, i) => ({
      label: `U${i + 1}`,
      skor: exam.irtScore ? Math.round(exam.irtScore) : 0,
      persen: exam.totalQuestions > 0 ? Math.round((exam.correctAnswers / exam.totalQuestions) * 100) : 0
    }));
  }, [history]);

  // Radar Data (Backend currently doesn't provide subject breakdown in history, so we show baseline 0 instead of dummy data)
  const radarData = useMemo(() => {
    return [
      { subject: 'Matematika', score: 0 },
      { subject: 'B. Indo', score: 0 },
      { subject: 'B. Inggris', score: 0 },
      { subject: 'Fisika', score: 0 },
      { subject: 'Kimia', score: 0 },
      { subject: 'Biologi', score: 0 },
    ];
  }, [history]);

  // Performa Mapel (Fallback to 0 if no real data)
  const mapelData = [
    { icon: "📐", name: "Matematika", val: 0 },
    { icon: "📖", name: "B. Indonesia", val: 0 },
    { icon: "🌐", name: "B. Inggris", val: 0 },
    { icon: "⚡", name: "Fisika", val: 0, warn: true },
    { icon: "🧪", name: "Kimia", val: 0, warn: true },
    { icon: "🌿", name: "Biologi", val: 0 },
  ];

  return (
    <div className="dash-grid fu">
      {/* BANNER */}
      <div className="banner fu">
        <div className="ban-row">
          <div>
            <div className="ban-h">Halo, {dpName.split(" ")[0]}! 👋</div>
            <div className="ban-p">
              {totalExams > 0 
                ? "Yuk lanjutkan latihan soalmu hari ini. Tingkatkan terus skormu!" 
                : "Mulai perjalanan belajarmu hari ini dengan mengerjakan latihan soal!"}
            </div>
          </div>
        </div>
      </div>

      {/* STAT GRID */}
      <div className="stat-grid fu d1">
        <div className="scard">
          <div className="sico t">📋</div>
          <div className="sbody">
            <div className="slabel">Latihan</div>
            <div className="sval">{loading ? "..." : totalExams}</div>
            <div className="ssub">Ujian selesai</div>
          </div>
        </div>
        <div className="scard">
          <div className="sico t">📊</div>
          <div className="sbody">
            <div className="slabel">Skor IRT</div>
            <div className="sval">{loading ? "..." : (avgScore || "—")}</div>
            <div className="ssub">Skala 0–1000</div>
          </div>
        </div>
        <div className="scard">
          <div className="sico o">🥇</div>
          <div className="sbody">
            <div className="slabel">Ranking</div>
            <div className="sval">—</div>
            <div className="ssub">Belum ada data</div>
          </div>
        </div>
        <div className="scard">
          <div className="sico o">🏆</div>
          <div className="sbody">
            <div className="slabel">Turnamen</div>
            <div className="sval">—</div>
            <div className="ssub">Belum ada turnamen</div>
          </div>
        </div>
      </div>

      {/* ── LEFT COL ── */}
      <div className="col-left">
        {/* CHART */}
        <div className="card fu d2">
          <div className="chead">
            <span className="ctitle">📈 Perkembangan Skor</span>
            <div className="ctabs">
              <button className={`ctab ${chartMode === "skor" ? "on" : ""}`} onClick={() => setChartMode("skor")}>Skor IRT</button>
              <button className={`ctab ${chartMode === "persen" ? "on" : ""}`} onClick={() => setChartMode("persen")}>Persen</button>
            </div>
          </div>
          <div className="cbody">
            <div className="cwrap">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-[var(--gray-400)] text-sm">Memuat data...</div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSkor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartMode === "skor" ? "#0d8a8e" : "#f97316"} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={chartMode === "skor" ? "#0d8a8e" : "#f97316"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                    <RechartsTooltip 
                      contentStyle={{backgroundColor: '#111827', borderRadius: '8px', border: 'none', color: '#fff'}}
                      itemStyle={{color: '#fff', fontSize: '12px'}}
                      labelStyle={{fontWeight: '700', marginBottom: '4px'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={chartMode} 
                      stroke={chartMode === "skor" ? "#0d8a8e" : "#f97316"} 
                      fillOpacity={1} 
                      fill="url(#colorSkor)" 
                      strokeWidth={2.5}
                      activeDot={{r: 6, strokeWidth: 2, stroke: '#fff'}}
                      dot={{r: 4, strokeWidth: 2, stroke: '#fff', fill: chartMode === "skor" ? "#0d8a8e" : "#f97316"}}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--gray-400)] text-sm">Belum ada riwayat ujian</div>
              )}
            </div>
          </div>
        </div>

        {/* PERFORMA */}
        <div className="card fu d3">
          <div className="chead"><span className="ctitle">🎯 Performa Mapel</span></div>
          <div className="cbody">
            <div className="pills">
              {["semua", "matematika", "b.indo", "b.inggris", "fisika", "kimia", "biologi"].map(p => (
                <button key={p} className={`pill ${activePill === p ? "on" : ""}`} onClick={() => setActivePill(p)}>
                  {p === "semua" ? "Semua" : p === "b.indo" ? "B. Indo" : p === "b.inggris" ? "B. Inggris" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            {mapelData.filter(p => activePill === "semua" || p.name.toLowerCase().includes(activePill.replace(".", ""))).map((p, i) => (
              <div className="pitem" key={i}>
                <div className="prow"><span>{p.icon} {p.name}</span><span className="pval">{p.val}/100</span></div>
                <div className="pbar">
                  <div className={`pfill ${p.warn ? "w" : ""}`} style={{width: mounted ? `${p.val}%` : '0%'}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIWAYAT */}
        <div className="card fu d4">
          <div className="chead">
            <span className="ctitle">🕐 Riwayat Terbaru</span>
            <Link href="/dashboard/history" className="clink">Lihat Semua →</Link>
          </div>
          <div className="rwlist">
            {loading ? (
              <div className="text-center text-xs text-[var(--gray-400)] py-4">Memuat data...</div>
            ) : recentExams.length > 0 ? (
              recentExams.map((exam) => (
                <Link href={`/dashboard/exams/${exam.id}/result`} key={exam.id} className="rwitem">
                  <div className={`rwico ${exam.type === "PRACTICE" ? "t" : "o"}`}>
                    {exam.type === "PRACTICE" ? "✏️" : exam.type === "TRYOUT" ? "📝" : "🏆"}
                  </div>
                  <div className="rwbody">
                    <div className="rwtitle">{exam.title}</div>
                    <div className="rwdate">
                      {new Date(exam.startedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} · {exam.totalQuestions} soal
                    </div>
                  </div>
                  {exam.status === "COMPLETED" ? (
                    <span className="rwscore">{exam.irtScore ? Math.round(exam.irtScore) : "—"}</span>
                  ) : (
                    <span className="rwbadge live">⬤ Berlangsung</span>
                  )}
                </Link>
              ))
            ) : (
              <div className="text-center text-xs text-[var(--gray-400)] py-4">Belum ada riwayat ujian</div>
            )}
          </div>
        </div>

      </div>{/* /col-left */}

      {/* ── RIGHT COL ── */}
      <div className="col-right">
        {/* MOTIVASI */}
        <div className="motivasi fu d2">
          <div className="mico">🚀</div>
          <div>
            <strong>{totalExams === 0 ? "Mulai Belajar!" : "Terus Semangat!"}</strong>
            <span>{totalExams === 0 ? "Coba latihan soal pertamamu hari ini." : "Latih terus kemampuanmu agar semakin siap."}</span>
          </div>
        </div>

        {/* AKSI CEPAT */}
        <div className="card fu d3">
          <div className="chead"><span className="ctitle">⚡ Aksi Cepat</span></div>
          <div className="aksi-row">
            <Link className="acard" href="/dashboard/exams/practice"><div className="aico t">✏️</div><div className="atitle">Latihan Soal</div><div className="adesc">Pilih bab, mulai latihan</div></Link>
            <Link className="acard o" href="/dashboard/exams/tryout"><div className="aico o">📋</div><div className="atitle">Tryout UTBK</div><div className="adesc">Simulasi lengkap UTBK</div></Link>
            <Link className="acard" href="/dashboard/tournaments"><div className="aico p">🏆</div><div className="atitle">Turnamen</div><div className="adesc">Kompetisi realtime</div></Link>
          </div>
        </div>

        {/* LEADERBOARD */}
        <div className="card fu d4">
          <div className="chead"><span className="ctitle">🏅 Leaderboard</span></div>
          <div className="lblist">
            <div className="text-center text-xs text-[var(--gray-400)] py-4">Belum ada data turnamen</div>
          </div>
        </div>

        {/* RADAR */}
        <div className="card fu d5">
          <div className="chead"><span className="ctitle">🕸 Peta Kemampuan</span></div>
          <div className="cbody">
            <div className="radwrap">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#4b5563', fontSize: 10, fontWeight: 600}} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skor" dataKey="score" stroke="#0d8a8e" fill="#0d8a8e" fillOpacity={0.15} dot={{r: 3, fill: '#0d8a8e'}} strokeWidth={2} />
                  <RechartsTooltip 
                    contentStyle={{backgroundColor: '#111827', borderRadius: '8px', border: 'none', color: '#fff'}}
                    itemStyle={{color: '#fff', fontSize: '12px'}}
                    labelStyle={{fontWeight: '700', marginBottom: '4px'}}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>{/* /col-right */}
    </div>
  );
}
