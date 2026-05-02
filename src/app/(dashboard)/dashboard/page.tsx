"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import type { ExamSession } from "@/lib/types";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const [chartMode, setChartMode] = useState<"skor" | "persen">("skor");
  const [activePill, setActivePill] = useState("semua");
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('TryOut');
  const tabs = ['TryOut', 'Belajar', 'Perkembangan'];

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

  const dpName = user?.fullName || "User";

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
    const sorted = [...history].sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
    return sorted.slice(-8).map((exam, i) => ({
      label: `U${i + 1}`,
      skor: exam.irtScore ? Math.round(exam.irtScore) : 0,
      persen: exam.totalQuestions > 0 ? Math.round((exam.correctAnswers / exam.totalQuestions) * 100) : 0
    }));
  }, [history]);

  // Radar Data
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

  // Performa Mapel
  const mapelData = [
    { icon: "📐", name: "Matematika", val: 0 },
    { icon: "📖", name: "B. Indonesia", val: 0 },
    { icon: "🌐", name: "B. Inggris", val: 0 },
    { icon: "⚡", name: "Fisika", val: 0, warn: true },
    { icon: "🧪", name: "Kimia", val: 0, warn: true },
    { icon: "🌿", name: "Biologi", val: 0 },
  ];

  return (
    <div className="min-h-screen flex justify-center p-4 md:p-8">
      {/* Container Utama */}
      <div className="w-full max-w-7xl grid grid-cols-12 gap-6 lg:gap-12 items-start my-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">

          {/* Header Sapaan */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Halo, {dpName.split(" ")[0]}! 👋</h1>
            <div className="relative inline-flex items-center mt-1 text-slate-500 font-semibold hover:text-teal-600 transition-colors">
              <select className="appearance-none bg-transparent outline-none cursor-pointer pr-5 z-10 text-base">
                <option value="snbt2026" className="text-slate-700">SNBT 2026</option>
                <option value="other" className="text-slate-700">Pilih lainnya...</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-0 h-4 w-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Navigasi Tab */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-base font-semibold transition-colors duration-200 ${activeTab === tab
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-slate-400 hover:text-slate-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Isi Konten Tab Dinamis */}
          <div className="min-h-[60vh]">

            {/* TAMPILAN TAB: TRYOUT */}
            {activeTab === 'TryOut' && (
              <div className="flex flex-col gap-8 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <Link href="/dashboard/exams/practice" className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-start gap-3 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-6xl opacity-20 group-hover:scale-110 transition-transform duration-300">✏️</div>
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm"><span className="text-xl leading-none block">✏️</span></div>
                    <div className="mt-1">
                      <h3 className="font-bold text-lg">Latihan Soal</h3>
                      <p className="text-teal-100 text-xs mt-1">Pilih bab, mulai latihan</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/exams/tryout" className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-start gap-3 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-6xl opacity-20 group-hover:scale-110 transition-transform duration-300">📋</div>
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm"><span className="text-xl leading-none block">📋</span></div>
                    <div className="mt-1">
                      <h3 className="font-bold text-lg">Tryout UTBK</h3>
                      <p className="text-orange-100 text-xs mt-1">Simulasi lengkap UTBK</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/tournaments" className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-start gap-3 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-6xl opacity-20 group-hover:scale-110 transition-transform duration-300">🏆</div>
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm"><span className="text-xl leading-none block">🏆</span></div>
                    <div className="mt-1">
                      <h3 className="font-bold text-lg">Turnamen</h3>
                      <p className="text-indigo-100 text-xs mt-1">Kompetisi realtime</p>
                    </div>
                  </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                      Riwayat Ujian
                    </span>
                    <Link href="/dashboard/history" className="text-sm font-semibold text-teal-600 hover:text-teal-700">Lihat Semuan →</Link>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {loading ? (
                      <div className="text-center text-xs text-slate-400 py-6">Memuat data...</div>
                    ) : recentExams.length > 0 ? (
                      recentExams.map((exam) => (
                        <Link href={`/dashboard/exams/${exam.id}/result`} key={exam.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${exam.type === "PRACTICE" ? "bg-teal-100 text-teal-600" : exam.type === "TRYOUT" ? "bg-orange-100 text-orange-600" : "bg-indigo-100 text-indigo-600"}`}>
                              {exam.type === "PRACTICE" ? "✏️" : exam.type === "TRYOUT" ? "📝" : "🏆"}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm">{exam.title}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {new Date(exam.startedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} · {exam.totalQuestions} soal
                              </div>
                            </div>
                          </div>
                          {exam.status === "COMPLETED" ? (
                            <div className="text-right">
                              <div className="text-xs text-slate-500 font-semibold mb-0.5">Skor IRT</div>
                              <div className="font-bold text-teal-600">{exam.irtScore ? Math.round(exam.irtScore) : "—"}</div>
                            </div>
                          ) : (
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-200">
                              ⬤ Berlangsung
                            </span>
                          )}
                        </Link>
                      ))
                    ) : (
                      <div className="text-center text-xs text-slate-400 py-6">Belum ada riwayat ujian</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAMPILAN TAB: BELAJAR */}
            {activeTab === 'Belajar' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🚀</span> Lanjutkan Pembelajaran
                  </h3>
                  <div className="bg-gradient-to-r from-teal-500 to-teal-400 text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                    <div className="absolute -right-6 -top-6 text-9xl opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">📖</div>
                    <div className="bg-white/20 p-4 rounded-2xl shrink-0 backdrop-blur-md">
                      <span className="text-4xl block leading-none">📖</span>
                    </div>
                    <div className="flex-1 w-full z-10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-white/20 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">UTBK SNBT</span>
                        <span className="font-bold text-xs bg-white text-teal-600 px-3 py-1 rounded-full shadow-sm">100% Selesai</span>
                      </div>
                      <h4 className="text-2xl font-bold mt-1">Penalaran Umum</h4>
                      <p className="text-teal-50 text-sm mt-1 mb-5">Bab 4: Penalaran Induktif & Deduktif</p>

                      <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-white h-full w-[100%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      <span className="text-2xl">📚</span> Materi Pembelajaran
                    </h3>
                    <button className="text-sm font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-full px-4 py-1.5 transition-colors">
                      Lihat Semua →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { title: 'Pengetahuan Kuantitatif', desc: 'Aritmatika, Aljabar, Geometri', icon: '📐', progress: 45, color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
                      { title: 'Literasi B. Indonesia', desc: 'Pemahaman teks & Argumentasi', icon: '📝', progress: 20, color: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-600' },
                      { title: 'Literasi B. Inggris', desc: 'Reading & Vocabulary', icon: '🌐', progress: 10, color: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-600' },
                      { title: 'Penalaran Matematika', desc: 'Pemecahan masalah matematis', icon: '🔢', progress: 0, color: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group">
                        <div className="flex items-center gap-4 mb-5">
                          <div className={`${item.light} ${item.text} w-14 h-14 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.progress}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-600 w-8 text-right">{item.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAMPILAN TAB: PERKEMBANGAN */}
            {activeTab === 'Perkembangan' && (
              <div className="space-y-8">
                {/* STAT GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center hover:border-teal-200 transition-colors">
                    <div className="w-12 h-12 bg-teal-50 text-2xl rounded-full flex items-center justify-center mb-3 shadow-sm">📋</div>
                    <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Latihan</div>
                    <div className="text-xl font-bold text-slate-800">{loading ? "..." : totalExams}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Ujian selesai</div>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center hover:border-orange-200 transition-colors">
                    <div className="w-12 h-12 bg-orange-50 text-2xl rounded-full flex items-center justify-center mb-3 shadow-sm">📊</div>
                    <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Skor IRT</div>
                    <div className="text-xl font-bold text-slate-800">{loading ? "..." : (avgScore || "—")}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Rata-rata 0–1000</div>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center hover:border-indigo-200 transition-colors">
                    <div className="w-12 h-12 bg-indigo-50 text-2xl rounded-full flex items-center justify-center mb-3 shadow-sm">🥇</div>
                    <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Ranking</div>
                    <div className="text-xl font-bold text-slate-800">—</div>
                    <div className="text-[10px] text-slate-400 mt-1">Belum ada data</div>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center hover:border-rose-200 transition-colors">
                    <div className="w-12 h-12 bg-rose-50 text-2xl rounded-full flex items-center justify-center mb-3 shadow-sm">🏆</div>
                    <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Turnamen</div>
                    <div className="text-xl font-bold text-slate-800">—</div>
                    <div className="text-[10px] text-slate-400 mt-1">Peringkat terbaik</div>
                  </div>
                </div>

                {/* CHART */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-800">📈 Perkembangan Skor</span>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      <button className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${chartMode === "skor" ? "bg-white text-teal-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setChartMode("skor")}>Skor IRT</button>
                      <button className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${chartMode === "persen" ? "bg-white text-teal-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setChartMode("persen")}>Persen</button>
                    </div>
                  </div>
                  <div className="h-64 p-4">
                    {loading ? (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Memuat data...</div>
                    ) : chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSkor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={chartMode === "skor" ? "#0d8a8e" : "#f97316"} stopOpacity={0.2} />
                              <stop offset="95%" stopColor={chartMode === "skor" ? "#0d8a8e" : "#f97316"} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                          <RechartsTooltip
                            contentStyle={{ backgroundColor: '#111827', borderRadius: '8px', border: 'none', color: '#fff' }}
                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                            labelStyle={{ fontWeight: '700', marginBottom: '4px' }}
                          />
                          <Area
                            type="monotone"
                            dataKey={chartMode}
                            stroke={chartMode === "skor" ? "#0d8a8e" : "#f97316"}
                            fillOpacity={1}
                            fill="url(#colorSkor)"
                            strokeWidth={2.5}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                            dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: chartMode === "skor" ? "#0d8a8e" : "#f97316" }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Belum ada riwayat ujian</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* RADAR */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100"><span className="font-bold text-slate-800">🕸 Peta Kemampuan</span></div>
                    <div className="flex-1 p-4 min-h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 600 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Skor" dataKey="score" stroke="#0d8a8e" fill="#0d8a8e" fillOpacity={0.15} dot={{ r: 3, fill: '#0d8a8e' }} strokeWidth={2} />
                          <RechartsTooltip
                            contentStyle={{ backgroundColor: '#111827', borderRadius: '8px', border: 'none', color: '#fff' }}
                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                            labelStyle={{ fontWeight: '700', marginBottom: '4px' }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* PERFORMA MAPEL */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100"><span className="font-bold text-slate-800">🎯 Performa Mapel</span></div>
                    <div className="p-4 flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {["semua", "matematika", "b.indo", "b.inggris", "fisika", "kimia", "biologi"].map(p => (
                          <button key={p} className={`px-3 py-1 text-xs font-semibold rounded-full border ${activePill === p ? "bg-teal-50 border-teal-200 text-teal-700" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`} onClick={() => setActivePill(p)}>
                            {p === "semua" ? "Semua" : p === "b.indo" ? "B. Indo" : p === "b.inggris" ? "B. Inggris" : p.charAt(0).toUpperCase() + p.slice(1)}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {mapelData.filter(p => activePill === "semua" || p.name.toLowerCase().includes(activePill.replace(".", ""))).map((p, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="text-slate-700">{p.icon} {p.name}</span>
                              <span className="text-slate-500">{p.val}/100</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${p.warn ? "bg-orange-400" : "bg-teal-500"}`} style={{ width: mounted ? `${p.val}%` : '0%' }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ========================================== */}
        {/* KOLOM KANAN: STICKY, DENGAN GARIS PEMISAH    */}
        {/* ========================================== */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-8 h-fit border-l border-slate-200 pl-8 space-y-10">

          {/* Kartu Premium */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-slate-700/50">
            {/* Dekorasi Bulatan */}
            <div className="absolute -top-12 -right-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl"></div>

            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="bg-amber-400/20 p-2.5 rounded-full border border-amber-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-amber-500">Upgrade Premium</h3>
            </div>

            <p className="text-sm text-slate-300 mb-6 relative z-10 leading-relaxed">
              Akses penuh ke tryout premium, pembahasan lengkap, dan seluruh materi belajar.
            </p>

            <button className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 relative z-10">
              Upgrade Sekarang
            </button>
          </div>

          {/* Runtutan / Timeline Aktivitas */}
          <div>
            <h3 className="font-bold text-slate-800 mb-5 text-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Aktivitas Terkini
            </h3>

            <div className="space-y-6 border-l-2 border-slate-200 ml-3">

              {loading ? (
                <div className="relative pl-6 text-xs text-slate-400">Memuat...</div>
              ) : recentExams.length > 0 ? (
                recentExams.map((exam, idx) => (
                  <div key={exam.id} className="relative pl-6">
                    <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ring-1 ring-slate-200 ${idx === 0 ? "bg-teal-500" : "bg-slate-300"}`}></span>
                    <h4 className="font-semibold text-sm text-slate-700">{exam.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(exam.startedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB
                    </p>
                  </div>
                ))
              ) : (
                <div className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white ring-1 ring-slate-200"></span>
                  <h4 className="font-semibold text-sm text-slate-700">Belum ada aktivitas</h4>
                  <p className="text-xs text-slate-400 mt-1">Ayo mulai belajar hari ini!</p>
                </div>
              )}

            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}