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
import { Hand, PenTool, Trophy, Rocket, PlayCircle, BookOpen, Calculator, BookText, Globe, Hash, ClipboardList, BarChart2, Medal, TrendingUp, Hexagon, Target, Zap, Beaker, Leaf, Book } from "lucide-react";

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const [chartMode, setChartMode] = useState<"skor" | "persen">("skor");
  const [activePill, setActivePill] = useState("semua");
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);
  const [activeTab, setActiveTab] = useState('TryOut');
  const tabs = ['TryOut', 'Belajar', 'Perkembangan'];
  const [openJurusan, setOpenJurusan] = useState(false);
  const [selectedJurusan, setSelectedJurusan] = useState("SNBT UTBK 2026");




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
    { icon: <Calculator size={16} />, name: "Matematika", val: 0 },
    { icon: <Book size={16} />, name: "B. Indonesia", val: 0 },
    { icon: <Globe size={16} />, name: "B. Inggris", val: 0 },
    { icon: <Zap size={16} />, name: "Fisika", val: 0, warn: true },
    { icon: <Beaker size={16} />, name: "Kimia", val: 0, warn: true },
    { icon: <Leaf size={16} />, name: "Biologi", val: 0 },
  ];

  // Tryout Yang Tersedia (Mock Data)
  const availableTryouts: any[] = [];

  // Lanjutkan Pembelajaran (Mock Data)
  const learningProgress: any[] = [];

  const jalurList = [
    {
      title: "SNBT UTBK 2026",
      subtitle: "Aktif sekarang",
      active: true,
    },
    {
      title: "TKA SMA 2026",
      subtitle: "Jelajahi jalur ini",
    },
    {
      title: "SKD Kedinasan 2026",
      subtitle: "Jelajahi jalur ini",
    },
    {
      title: "UM UNDIP 2026",
      subtitle: "Jelajahi jalur ini",
    },
    {
      title: "CBT-UM UGM 2026",
      subtitle: "Jelajahi jalur ini",
    },
  ];

  useEffect(() => {
    if (learningProgress.length > 0) {
      const timer = setTimeout(() => {
        setProgressWidth(learningProgress[0].progress);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [learningProgress]);

  return (
    <div className="min-h-screen flex justify-center px-4 md:px-8 pt-4 md:pt-6 pb-32">
      {/* Container Utama */}
      <div className="w-full max-w-7xl grid grid-cols-12 gap-6 lg:gap-12 items-start mt-2 mb-24">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">

          {/* Header Sapaan */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">Halo, {dpName.split(" ")[0]}! <Hand className="text-yellow-500" size={32} /></h1>
            <div className="relative mt-1 w-[320px]">

              {/* BUTTON */}
              <button
                onClick={() => setOpenJurusan(!openJurusan)}
                className="w-full flex items-center  rounded-2xl">

                <div className="flex items-center gap-3">


                  <div className="text-left">
                    <p className="font-semibold text-slate-800 text-lg hover:text-teal-600 transition-colors">
                      {selectedJurusan}
                    </p>
                  </div>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openJurusan ? "rotate-180" : ""
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* DROPDOWN */}
              {openJurusan && (
                <div className="absolute z-50 mt-4 w-[calc(100vw-32px)] max-w-[400px] -left-2 sm:left-0 ml-4 sm:ml-0 rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">


                  {/* LIST */}
                  <div className="max-h-[420px] overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">

                    {jalurList.map((item, idx) => {
                      const isActive = selectedJurusan === item.title;

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedJurusan(item.title);
                            setOpenJurusan(false);
                          }}
                          className={`w-full flex items-center justify-between pr-4 rounded-2xl px-5 py-4 transition-all duration-200 border ${isActive
                            ? "bg-teal-50/60 border-teal-100/50 shadow-sm"
                            : "bg-white border-slate-100 shadow-sm hover:bg-slate-50 hover:border-slate-300"
                            }`}
                        >
                          <div className="flex items-center gap-4" style={{ padding: '16px 24px' }}>
                            {/* TEXT */}
                            <div className="text-left flex flex-col gap-1.5">
                              <h4 className={`font-bold text-[15px] leading-none ${isActive ? "text-teal-900" : "text-slate-800"}`}>
                                {item.title}
                              </h4>
                              <p className={`text-[13px] leading-none ${isActive ? "text-teal-600 font-semibold" : "text-slate-400"}`}>
                                {isActive ? "Aktif sekarang" : "Jelajahi jalur ini"}
                              </p>
                            </div>
                          </div>

                          {/* CHECK */}
                          {isActive && (
                            <div className="w-10 h-10 rounded-fullflex items-center justify-center shrink-0 mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 text-teal-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
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
          <div className="min-h-[40vh]">

            {/* TAMPILAN TAB: TRYOUT */}
            {activeTab === 'TryOut' && (
              <div className="flex flex-col gap-6 pt-2 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/dashboard/exams/practice"
                    className="bg-gradient-to-br from-teal-500 to-teal-600 text-white px-4 py-5 md:py-6 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group min-h-[120px]">
                    {/* Icon background (pojok kanan atas) */}
                    <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-110 transition-transform duration-300 pointer-events-none text-white">
                      <PenTool size={90} strokeWidth={1.5} />
                    </div>

                    {/* Icon utama */}
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-inner relative z-10 text-white flex items-center justify-center">
                      <PenTool size={32} />
                    </div>

                    {/* Text */}
                    <div className="mt-1 relative z-10">
                      <h3 className="font-bold text-white text-lg md:text-xl leading-tight">
                        Latihan Soal
                      </h3>
                      <p className="text-teal-100 text-xs md:text-sm mt-1 leading-relaxed">
                        Pilih bab, mulai latihan
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/tournaments"
                    className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-4 py-5 md:py-6 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group min-h-[120px]">
                    {/* Icon background (pojok kanan atas) */}
                    <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-110 transition-transform duration-300 pointer-events-none text-white">
                      <Trophy size={90} strokeWidth={1.5} />
                    </div>

                    {/* Icon utama */}
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-inner relative z-10 text-white flex items-center justify-center">
                      <Trophy size={32} />
                    </div>

                    {/* Text */}
                    <div className="mt-1 relative z-10">
                      <h3 className="font-bold text-white text-lg md:text-xl leading-tight">
                        Turnamen
                      </h3>
                      <p className="text-indigo-100 text-xs md:text-sm mt-1 leading-relaxed">
                        Kompetisi realtime
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <span className="text-teal-600"><Rocket size={24} /></span> Tryout yang tersedia
                  </h3>
                  <div className="flex flex-col gap-4">
                    {availableTryouts.slice(0, 5).map((tryout) => (
                      <Link
                        href={`/dashboard/tryout/${tryout.id}`}
                        key={tryout.id}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-3xl shadow-sm flex flex-row items-stretch gap-3 md:gap-4 relative overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all min-h-[85px]"
                      >
                        {/* Icon */}
                        <div className="bg-white w-16 md:w-24 flex-shrink-0 flex items-center justify-center shadow-md z-10 py-4 md:py-0 transition-colors duration-300 group-hover:bg-slate-50">

                          <img
                            src="/snbt2.png"
                            alt="SNBT"
                            className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 w-full z-10 flex flex-col justify-center py-4 px-3 md:p-5">
                          <span className="bg-white/20 text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1 rounded-md w-fit mb-1.5 text-white">
                            {tryout.type}
                          </span>

                          <h4 className="text-lg md:text-xl font-bold leading-tight text-white">
                            {tryout.title}
                          </h4>

                          <p className="text-teal-50 text-xs md:text-sm mt-1 md:mt-1.5">
                            {tryout.date}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {availableTryouts.length > 5 && (
                    <Link href="/dashboard/exams/available" className="text-center text-sm font-semibold text-teal-600 hover:text-teal-700 mt-2">
                      Lihat lainnya ({availableTryouts.length - 5} tryout) →
                    </Link>
                  )}
                </div>

                {/* <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                      Riwayat Ujian
                    </span>
                    <Link href="/dashboard/history" className="text-sm font-semibold text-teal-600 hover:text-teal-700">Lihat Semua →</Link>
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
                </div> */}
              </div>
            )}

            {/* TAMPILAN TAB: BELAJAR */}
            {activeTab === 'Belajar' && (
              <div className="flex flex-col gap-8 pt-2 pb-20">
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <span className="text-teal-600"><Rocket size={24} /></span> Lanjutkan Pembelajaran
                  </h3>
                  <div className="flex flex-col gap-4">
                    {learningProgress.map((item) => (
                      <div
                        key={item.id}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-3xl shadow-sm flex flex-row items-stretch gap-3 md:gap-4 relative overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all min-h-[110px]"
                      >
                        {/* Background Icon */}
                        <div className="absolute right-2 top-2 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 pointer-events-none text-white">
                          <PlayCircle size={70} strokeWidth={1.5} />
                        </div>

                        {/* Icon (Left Panel) */}
                        <div className="bg-teal-600 w-16 md:w-20 flex-shrink-0 flex items-center justify-center shadow-md py-4 md:py-0 transition-all duration-300 group-hover:bg-teal-700 text-white">
                          <span className="transition-transform duration-300 group-hover:scale-110">
                            <PlayCircle size={32} />
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center py-4 px-3 md:p-5 gap-2">

                          {/* Top */}
                          <div className="flex justify-between items-center gap-3 pr-2">
                            <span className="bg-white/20 text-[10px] md:text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wide">
                              {item.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-lg md:text-xl font-bold leading-tight">
                            {item.title}
                          </h4>

                          {/* Subtitle */}
                          <p className="text-teal-50 text-xs md:text-sm">
                            {item.subtitle}
                          </p>

                          {/* Progress Bar */}
                          <div className="w-full mt-1.5">

                            {/* Label + persen */}
                            <div className="flex text-[10px] md:text-xs text-white/80 mb-1">
                              <span className="font-bold">{progressWidth}%</span>
                            </div>

                            {/* Bar background */}
                            <div className="w-full bg-white/20 h-1.5 md:h-2 rounded-full overflow-hidden">

                              {/* Bar isi (ANIMASI) */}
                              <div
                                className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                                style={{ width: `${item.progress}%` }}
                              ></div>

                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <span className="text-teal-600"><BookOpen size={24} /></span> Materi Pembelajaran
                  </h3>
                  <Link href="dashboard/subjects" className="text-sm font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-full px-4 py-1.5 transition-colors">
                    Lihat Semua →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { title: 'Penalaran Umum', desc: 'Aritmatika, Aljabar, Geometri', icon: <Calculator size={24} />, progress: 45, color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', href: '/belajar/penalaran-umum' },
                    { title: 'Literasi B. Indonesia', desc: 'Pemahaman teks & Argumentasi', icon: <BookText size={24} />, progress: 20, color: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-600', href: '/belajar/bahasa-indonesia' },
                    { title: 'Literasi B. Inggris', desc: 'Reading & Vocabulary', icon: <Globe size={24} />, progress: 10, color: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-600', href: '/belajar/bahasa-inggris' },
                    { title: 'Penalaran Matematika', desc: 'Pemecahan masalah matematis', icon: <Hash size={24} />, progress: 0, color: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600', href: '/belajar/matematika' }
                  ].map((item, idx) => (
                    <Link href={item.href} key={idx} className="bg-white border border-slate-200 p-3 md:p-4 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group min-h-[60px] flex flex-col justify-center" style={{ textDecoration: 'none' }}>
                      <div className="flex items-center gap-3 md:gap-4 pr-2 md:pr-4">
                        <div className={`${item.light} ${item.text} w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm md:text-base text-slate-800 line-clamp-1">{item.title}</h4>
                          <p className="text-[11px] md:text-xs text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* TAMPILAN TAB: PERKEMBANGAN */}
            {activeTab === 'Perkembangan' && (
              <div className="flex flex-col gap-8 pt-2 pb-20">
                {/* STAT GRID */}
                {/* STAT GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                  <div className="bg-white border border-slate-200 px-3 py-4 md:py-5 rounded-[20px] shadow-sm flex flex-col items-center justify-center text-center hover:border-teal-200 hover:shadow-md transition-all duration-300 min-h-[100px] md:min-h-[120px]">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-50 text-xl md:text-2xl rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 shadow-sm text-teal-600">
                      <ClipboardList size={24} />
                    </div>

                    <div className="text-[10px] md:text-[11px] text-slate-500 font-semibold tracking-widest uppercase mb-1 md:mb-1.5">
                      Latihan
                    </div>

                    <div className="text-xl md:text-2xl font-bold text-slate-800 leading-none">
                      {loading ? "..." : totalExams}
                    </div>

                    <div className="text-[10px] md:text-xs text-slate-400 mt-1 md:mt-2 leading-relaxed">
                      Ujian selesai
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 px-3 py-4 md:py-5 rounded-[20px] shadow-sm flex flex-col items-center justify-center text-center hover:border-orange-200 hover:shadow-md transition-all duration-300 min-h-[100px] md:min-h-[120px]">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 text-xl md:text-2xl rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 shadow-sm text-orange-600">
                      <BarChart2 size={24} />
                    </div>

                    <div className="text-[10px] md:text-[11px] text-slate-500 font-semibold tracking-widest uppercase mb-1 md:mb-1.5">
                      Skor IRT
                    </div>

                    <div className="text-xl md:text-2xl font-bold text-slate-800 leading-none">
                      {loading ? "..." : (avgScore || "—")}
                    </div>

                    <div className="text-[10px] md:text-xs text-slate-400 mt-1 md:mt-2 leading-relaxed">
                      Rata-rata 0–1000
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 px-3 py-4 md:py-5 rounded-[20px] shadow-sm flex flex-col items-center justify-center text-center hover:border-indigo-200 hover:shadow-md transition-all duration-300 min-h-[100px] md:min-h-[120px]">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-xl md:text-2xl rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 shadow-sm text-indigo-600">
                      <Medal size={24} />
                    </div>

                    <div className="text-[10px] md:text-[11px] text-slate-500 font-semibold tracking-widest uppercase mb-1 md:mb-1.5">
                      Ranking
                    </div>

                    <div className="text-xl md:text-2xl font-bold text-slate-800 leading-none">
                      —
                    </div>

                    <div className="text-[10px] md:text-xs text-slate-400 mt-1 md:mt-2 leading-relaxed">
                      Belum ada data
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 px-3 py-4 md:py-5 rounded-[20px] shadow-sm flex flex-col items-center justify-center text-center hover:border-rose-200 hover:shadow-md transition-all duration-300 min-h-[100px] md:min-h-[120px]">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-50 text-xl md:text-2xl rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 shadow-sm text-rose-600">
                      <Trophy size={24} />
                    </div>

                    <div className="text-[10px] md:text-[11px] text-slate-500 font-semibold tracking-widest uppercase mb-1 md:mb-1.5">
                      Turnamen
                    </div>

                    <div className="text-xl md:text-2xl font-bold text-slate-800 leading-none">
                      —
                    </div>

                    <div className="text-[10px] md:text-xs text-slate-400 mt-1 md:mt-2 leading-relaxed">
                      Peringkat terbaik
                    </div>
                  </div>
                </div>

                {/* CHART */}
                <div className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden min-h-[260px]">
                  <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center gap-4">
                    <span className="font-bold text-slate-800 text-[14px] md:text-[15px] tracking-wide flex items-center gap-2"><TrendingUp size={18} className="text-teal-600" /> Perkembangan Skor</span>
                    <div className="flex bg-slate-100 p-1 md:p-1.5 rounded-xl shrink-0 ">
                      <button className={`px-2.5 py-1 text-[11px] md:text-xs font-semibold rounded-md transition-colors ${chartMode === "skor" ? "bg-white text-teal-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setChartMode("skor")}>Skor IRT</button>
                      <button className={`px-2.5 py-1 text-[11px] md:text-xs font-semibold rounded-md transition-colors ${chartMode === "persen" ? "bg-white text-teal-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setChartMode("persen")}>Persen</button>
                    </div>
                  </div>
                  <div className="h-48 md:h-56 px-3 md:px-5 pb-3 md:pb-5 pt-2 md:pt-3">
                    {loading ? (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Memuat data...</div>
                    ) : chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
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
                    <div className="p-4 md:p-5 border-b border-slate-100"><span className="font-bold text-slate-800 text-[14px] md:text-[15px] flex items-center gap-2"><Hexagon size={18} className="text-teal-600" /> Peta Kemampuan</span></div>
                    <div className="flex-1 p-3 md:p-4 min-h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
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
                    <div className="p-4 md:p-5 border-b border-slate-100"><span className="font-bold text-slate-800 text-[14px] md:text-[15px] flex items-center gap-2"><Target size={18} className="text-teal-600" /> Performa Mapel</span></div>
                    <div className="flex-1 p-4 md:p-5">
                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
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

          <div className="h-32 md:h-12 w-full shrink-0 block"></div>
        </div>

        {/* ========================================== */}
        {/* KOLOM KANAN: STICKY, DENGAN GARIS PEMISAH    */}
        {/* ========================================== */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-8 h-fit border-l border-slate-200 pl-7 space-y-4">

          {/* Kartu Premium */}
          {user?.role === 'STUDENT' && (
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col gap-3 md:gap-4 p-4 md:p-5">

              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-800 leading-tight">Upgrade Premium</p>
                  <p className="text-xs text-slate-400 leading-tight">Akses tak terbatas</p>
                </div>
              </div>

              {/* Fitur */}
              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                {[
                  "Tryout premium tak terbatas",
                  "Pembahasan lengkap & video",
                  "Seluruh materi belajar",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-teal-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[13px] text-slate-500">{item}</span>
                  </div>
                ))}
              </div>

              {/* Tombol */}
              <button
                className="w-full rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-95 transition-all text-amber-900 font-bold text-sm flex items-center justify-center gap-2"
                style={{ padding: '10px 16px', border: '1.5px solid #d97706' }}
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Upgrade Sekarang
              </button>

            </div>
          )}

          {/* Runtutan / Timeline Aktivitas */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-[14px] flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Aktivitas
              </h3>

              {/* UBAH: plain text → pill badge */}
              <span className="text-[11px] font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">
                {recentExams.length} aktivitas
              </span>
            </div>

            {/* Timeline */}
            {/* Timeline */}
            <div className="relative">

              <div className="space-y-3">

                {loading ? (
                  <div className="text-xs text-slate-400 py-1 pl-2">
                    Memuat aktivitas...
                  </div>
                ) : recentExams.length > 0 ? (

                  recentExams.map((exam, idx) => (
                    <div key={exam.id} className="flex gap-3">

                      <div className="flex flex-col items-center" style={{ width: '16px', flexShrink: 0 }}>
                        {/* Titik */}
                        <div className={`w-3 h-3 rounded-full mt-2 shrink-0 ${idx === 0 ? "bg-teal-500 ring-2 ring-teal-100" : "bg-slate-300 ring-2 ring-slate-100"
                          }`} />
                        {idx < recentExams.length - 1 && (
                          <div className="w-[1.5px] bg-slate-200 flex-1 mt-1" />
                        )}
                      </div>

                      {/* Kolom kanan: card */}
                      <div className="flex-1 pb-0">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 hover:bg-white hover:shadow-sm transition-all duration-200">
                          <h4 className="font-semibold text-[12.5px] text-slate-700 leading-snug">
                            {exam.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1.5 leading-none">
                            {new Date(exam.startedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })} WIB
                          </p>
                        </div>
                      </div>

                    </div>
                  ))

                ) : (

                  <div className="flex gap-3">
                    <div style={{ width: '16px', flexShrink: 0 }} className="flex items-start justify-center pt-2">
                      <div className="w-3 h-3 rounded-full bg-slate-300 ring-2 ring-slate-100" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5">
                        <h4 className="font-semibold text-[12.5px] text-slate-700 leading-snug">
                          Belum ada aktivitas
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-none flex items-center gap-1">
                          Ayo mulai belajar hari ini <Rocket size={12} className="text-teal-500" />
                        </p>
                      </div>
                    </div>
                  </div>

                )}

              </div>
            </div>
          </div>

        </aside>

      </div>
    </div >
  );
}