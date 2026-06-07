"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";

type TryoutData = {
  id: string;
  type: string;
  title: string;
  duration: number;
  questions: number;
  system: string;
  description: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const initialSubtests = [
  { id: "1", title: "Penalaran Umum", duration: "30 menit 30 soal" },
  { id: "2", title: "Pengetahuan dan Pemahaman Umum", duration: "30 menit 30 soal" },
  { id: "3", title: "Kemampuan Memahami Bacaan dan Menulis", duration: "30 menit 30 soal" },
  { id: "4", title: "Pengetahuan Kuantitatif", duration: "30 menit 30 soal" },
  { id: "5", title: "Literasi dalam Bahasa Indonesia", duration: "30 menit 30 soal" },
  { id: "6", title: "Literasi dalam Bahasa Inggris", duration: "30 menit 30 soal" },
  { id: "7", title: "Penalaran Matematika", duration: "30 menit 30 soal" },
];

const dummyTryouts: TryoutData[] = [];

export default function HalamanDetailTryout({ params }: PageProps) {
  const unwrappedParams = use(params);
  const tryoutId = unwrappedParams.id;
  
  const [tryoutData, setTryoutData] = useState<TryoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subtests, setSubtests] = useState(initialSubtests);

  const dragItem = useRef<number>(0);
  const dragOverItem = useRef<number>(0);

  const handleSort = () => {
    const subtestsClone = [...subtests];
    const temp = subtestsClone[dragItem.current];
    subtestsClone.splice(dragItem.current, 1);
    subtestsClone.splice(dragOverItem.current, 0, temp);
    setSubtests(subtestsClone);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const dataDitemukan = dummyTryouts.find((item) => item.id === tryoutId);
      setTryoutData(dataDitemukan || null); 
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [tryoutId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          <p className="text-teal-600 font-medium animate-pulse">Memuat data tryout...</p>
        </div>
      </div>
    );
  }

  if (!tryoutData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6 bg-slate-50">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Tryout Tidak Ditemukan</h2>
        <p className="text-slate-500 max-w-md">Tryout yang Anda cari mungkin telah dihapus atau tidak tersedia saat ini.</p>
        <Link href="/dashboard" className="bg-teal-600 text-white px-6 py-2.5 rounded-xl mt-2 font-medium hover:bg-teal-700 transition shadow-sm">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-5 sm:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-3">
            <Link 
              href="/dashboard" 
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2 w-fit"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
              Kembali
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {tryoutData.title}
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                {tryoutData.description}
              </p>
            </div>
          </div>
          
          {/* TOMBOL KERJAKAN */}
          <button 
            className="w-full md:w-auto rounded-xl font-bold text-[18px] transition-all shadow-lg flex items-center justify-center gap-[8px]"
            style={{ backgroundColor: '#0d9488', color: '#ffffff', padding: '14px 32px', border: 'none' }}
          >
            <span>Kerjakan Sekarang</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
        </div>

        {/* INFO UMUM */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:border-teal-100 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div className="flex flex-col">
              <p className="text-slate-500 text-sm font-medium">Durasi Total</p>
              <p className="text-slate-900 font-bold text-lg">{tryoutData.duration} Menit</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:border-teal-100 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div className="flex flex-col">
              <p className="text-slate-500 text-sm font-medium">Jumlah Soal</p>
              <p className="text-slate-900 font-bold text-lg">{tryoutData.questions} Soal</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:border-teal-100 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="flex flex-col">
              <p className="text-slate-500 text-sm font-medium">Sistem Penilaian</p>
              <p className="text-slate-900 font-bold text-lg">{tryoutData.system}</p>
            </div>
          </div>
        </div>

        {/* KARTU DAFTAR SUBTES */}
        <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
          
          <div 
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-[8px] border-b border-[#f1f5f9] bg-white"
            style={{ padding: '24px' }}
          >
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0f172a]">Daftar Subtes Tryout</h2>
            <span className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full w-fit">
              Urutkan dengan menggeser ↕
            </span>
          </div>

          <ul className="flex flex-col bg-white w-full divide-y divide-slate-100">
            {subtests.map((sub, index) => (
              <li
                key={sub.id}
                draggable
                onDragStart={() => (dragItem.current = index)}
                onDragEnter={() => (dragOverItem.current = index)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center justify-between border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition duration-150 cursor-grab active:cursor-grabbing group w-full"
                style={{ padding: '20px 24px' }}
              >
                <div className="flex flex-col gap-[8px]" style={{ paddingRight: '16px' }}>
                  <div className="flex items-start gap-[12px]">
                    <span className="flex items-center justify-center w-[24px] h-[24px] rounded-full bg-[#f1f5f9] text-[#64748b] text-[12px] font-bold shrink-0 mt-[2px]">
                      {index + 1}
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                      {sub.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-9">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <p className="text-sm font-medium text-slate-500">
                      {sub.duration}
                    </p>
                  </div>
                </div>
                
                <div className="text-slate-300 group-hover:text-teal-600 transition p-2 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* FOOTER */}
        <div className="mt-4 text-center pb-10">
          <p className="text-base font-medium text-slate-400 flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Siapkan dirimu sebaik mungkin sebelum memulai ujian.
          </p>
        </div>

      </div>
    </div>
  );
}