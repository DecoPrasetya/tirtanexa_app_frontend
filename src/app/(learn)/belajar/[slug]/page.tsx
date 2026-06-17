"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Menu, Search, User } from "lucide-react";
import type { Subject, Chapter } from "@/lib/types";
const dummySubjects: Record<string, Subject> = {};


export default function LearnPage() {
    const params = useParams();
    const slug = params?.slug as string;

    // Fallback jika tidak ada params (saat hydration pertama kali)
    const subject = dummySubjects[slug as keyof typeof dummySubjects];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    if (!subject) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', backgroundColor: '#f7f7f7' }}>
                <div className="p-10 text-xl font-bold text-[var(--text-muted)]">
                    Materi tidak ditemukan.
                </div>
            </div>
        );
    }

    // Safely access chapters; fallback to first chapter if undefined
    const currentChapter = subject.chapters?.[currentIndex] ?? subject.chapters?.[0];

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const handleNext = () => {
        if (subject.chapters && currentIndex < subject.chapters.length - 1) setCurrentIndex(currentIndex + 1);
    };

    return (
        <div className="flex flex-col w-full bg-[#fafafa] text-[var(--text)] font-sans" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', width: '100%', backgroundColor: '#fafafa', color: 'var(--text)', fontFamily: 'sans-serif', overflow: 'hidden' }}>

            <style dangerouslySetInnerHTML={{
                __html: `
                .desktop-search { display: flex !important; }
                .mobile-search-btn { display: none !important; }
                
                @media (max-width: 768px) {
                    .desktop-search { display: none !important; }
                    .mobile-search-btn { display: flex !important; }
                    .main-content-pad { padding: 24px !important; }
                    .sidebar-container { 
                        position: fixed !important; 
                        right: 0 !important; 
                        top: 0 !important; 
                        bottom: 0 !important; 
                        z-index: 50 !important; 
                        box-shadow: -4px 0 15px rgba(0,0,0,0.1) !important;
                    }
                    .footer-container { padding: 0 16px !important; }
                    .footer-btn-text { display: none !important; }
                    .header-container { padding: 0 16px !important; }
                }
            `}} />

            {/* Mobile Search Popup Overlay */}
            {isMobileSearchOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ backgroundColor: 'var(--surface)', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                        <button onClick={() => setIsMobileSearchOpen(false)} style={{ border: 'none', background: 'transparent', padding: '8px', cursor: 'pointer' }}>
                            <ChevronLeft style={{ width: '24px', height: '24px', color: 'var(--text)' }} />
                        </button>
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center', backgroundColor: 'var(--bg-alt)', padding: '10px 16px', borderRadius: '12px' }}>
                            <Search style={{ width: '16px', height: '16px', color: 'var(--text-muted)', marginRight: '12px' }} />
                            <input autoFocus type="text" placeholder="Cari soal/materi" style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: 'var(--text)' }} />
                        </div>
                    </div>
                    <div style={{ flex: 1 }} onClick={() => setIsMobileSearchOpen(false)}></div>
                </div>
            )}

            {/* Topbar */}
            <header className="header-container border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between shrink-0 z-30 relative" style={{ height: '76px', borderBottom: '1.5px solid var(--border)', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 30, position: 'relative' }}>
                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/dashboard/admin/subjects" className="hover:bg-[var(--surface-hover)] p-2 rounded-full transition-colors" style={{ padding: '8px', borderRadius: '9999px' }}>
                        <ChevronLeft className="w-7 h-7 stroke-[2.5]" style={{ width: '28px', height: '28px' }} />
                    </Link>
                    <h1 className="text-xl font-black" style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>{subject.name}</h1>
                </div>

                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

                    {/* Desktop Search */}
                    <div className="desktop-search items-center bg-[var(--bg-alt)] rounded-xl" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-alt)', padding: '10px 16px', borderRadius: '12px', width: '300px' }}>
                        <Search className="w-4 h-4 text-[var(--text-muted)] mr-3" style={{ width: '16px', height: '16px', color: 'var(--text-muted)', marginRight: '12px' }} />
                        <input
                            type="text"
                            placeholder="Cari soal/materi"
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--text-muted)] font-medium"
                            style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: 'var(--text)' }}
                        />
                    </div>

                    {/* Mobile Search Icon */}
                    <button
                        className="mobile-search-btn"
                        onClick={() => setIsMobileSearchOpen(true)}
                        style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'var(--bg-alt)', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
                    >
                        <Search className="w-5 h-5 text-[var(--text-secondary)]" style={{ width: '20px', height: '20px', color: 'var(--text-secondary)' }} />
                    </button>

                    <div className="w-10 h-10 bg-[var(--bg-alt)] rounded-full" style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-alt)', borderRadius: '9999px' }}></div>
                    <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center text-white" style={{ width: '40px', height: '40px', backgroundColor: '#2dd4bf', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <User className="w-5 h-5" style={{ width: '20px', height: '20px' }} />
                    </div>
                </div>
            </header>

            {/* Main Layout Area */}
            <div className="flex flex-1 overflow-hidden relative" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

                {/* Left side (Video + Text Content) */}
                <main className="flex-1 overflow-y-auto bg-[var(--surface)] relative" style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--surface)', position: 'relative' }}>

                    {/* Floating Menu Button (if sidebar is closed) */}
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="absolute top-6 right-6 p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm hover:bg-[var(--surface-hover)] z-10 transition-all"
                            style={{ position: 'absolute', top: '24px', right: '24px', padding: '10px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', zIndex: 10, cursor: 'pointer' }}
                        >
                            <Menu className="w-6 h-6 text-[var(--text-secondary)]" style={{ width: '24px', height: '24px', color: 'var(--text)' }} />
                        </button>
                    )}

                    <div className="main-content-pad max-w-[900px] mx-auto p-8 md:p-14" style={{ maxWidth: '900px', margin: '0 auto', padding: '56px 32px' }}>


                        {/* Content Text */}
                        <div>
                            <h2 className="text-[22px] font-black mb-4" style={{ fontSize: '22px', fontWeight: 900, marginBottom: '16px' }}>Pengenalan Kelas</h2>
                            <p className="text-[15px] font-medium leading-relaxed text-[var(--text)] whitespace-pre-wrap" style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.6, color: '#1e293b', whiteSpace: 'pre-wrap' }}>
                                {currentChapter?.description ?? ''}
                            </p>

                            <p className="text-[15px] font-medium leading-relaxed text-[var(--text)] mt-4" style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.6, color: '#1e293b', marginTop: '16px' }}>
                                Berikut adalah susunan materi yang akan Anda pelajari pada kelas ini.
                            </p>

                            <ul className="mt-2 space-y-2 text-[15px] font-medium text-[var(--text)]" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px', fontWeight: 500, color: '#1e293b' }}>
                                <li>
                                    <span className="font-bold" style={{ fontWeight: 'bold' }}>• Modul 1: The Power of Data</span>
                                    <p className="mt-1 ml-4 text-[var(--text-secondary)]" style={{ marginTop: '4px', marginLeft: '16px', color: 'var(--text)' }}>Modul ini menunjukkan secara luas tentang data mulai dari Berkenalan dengan Data; kemudian menjelaskan terkait data, data, dan keputusan; hingga terdapat latihan terkait data untuk mengasah kemampuan setelah pemaparan materi.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar (Daftar Modul) */}
                <aside
                    className={`sidebar-container border-l-[1.5px] border-[var(--border)] bg-[#fafafa] flex flex-col shrink-0 transition-all duration-300 ease-in-out absolute md:relative h-full right-0 z-20`}
                    style={{ borderLeft: '1.5px solid var(--border)', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'all 0.3s ease', position: isSidebarOpen ? 'relative' : 'absolute', height: '100%', right: 0, zIndex: 20, width: isSidebarOpen ? '340px' : '0px', transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)', overflow: 'hidden' }}
                >
                    {isSidebarOpen && (
                        <div style={{ width: '340px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* Sidebar Header */}
                            <div className="h-[80px] border-b-[1.5px] border-[var(--border)] flex items-center px-6" style={{ height: '80px', borderBottom: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', flexShrink: 0 }}>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="w-[34px] h-[34px] bg-teal-400 text-white rounded-full flex items-center justify-center mr-4 hover:bg-teal-500 transition-colors"
                                    style={{ width: '34px', height: '34px', backgroundColor: '#2dd4bf', color: 'white', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', border: 'none', cursor: 'pointer' }}
                                >
                                    <ChevronRight className="w-6 h-6 stroke-[2.5]" style={{ width: '24px', height: '24px' }} />
                                </button>
                                <h3 className="font-bold text-[17px] text-[var(--text)]" style={{ fontWeight: 'bold', fontSize: '17px', color: '#1e293b', margin: 0 }}>Daftar Modul</h3>
                            </div>

                            {/* Sidebar List */}
                            <div className="flex-1 overflow-y-auto p-2 pt-6" style={{ flex: 1, overflowY: 'auto', padding: '24px 8px 8px 8px' }}>
                                {subject.chapters?.map((chap: Chapter, idx: number) => {
                                    const isActive = currentIndex === idx;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`w-full text-left px-6 py-4 flex items-center justify-between group`}
                                            style={{ width: '100%', textAlign: 'left', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: isActive ? '#f0fdfa' : 'transparent', cursor: 'pointer' }}
                                        >
                                            <span className={`text-[15px] font-black transition-colors`} style={{ fontSize: '15px', fontWeight: 900, color: isActive ? 'var(--text)' : 'var(--text-secondary)' }}>
                                                {chap.name}
                                            </span>

                                            {/* Radio Button Indicator */}
                                            <div className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center shrink-0 transition-colors`} style={{ width: '20px', height: '20px', borderRadius: '50%', border: isActive ? '2px solid #2dd4bf' : '2px solid var(--text-muted)', backgroundColor: isActive ? '#2dd4bf' : 'transparent', flexShrink: 0 }}>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Bottom Footer */}
            <footer className="footer-container border-t-[1.5px] border-[var(--border)] bg-[var(--surface)] flex items-center justify-between shrink-0 relative z-30" style={{ height: '80px', borderTop: '1.5px solid var(--border)', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0, position: 'relative', zIndex: 30 }}>
                {/* Previous Button */}
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-3 font-black text-[15px]`}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 900, fontSize: '15px', color: currentIndex === 0 ? '#cbd5e1' : 'var(--text)', background: 'transparent', border: 'none', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
                >
                    <ChevronLeft className="w-6 h-6 stroke-[3]" style={{ width: '24px', height: '24px' }} />
                    <span className="footer-btn-text">Sebelumnya</span>
                </button>

                {/* Current Chapter Title (Center) */}
                <div className="font-black text-[var(--text)] text-[15px] text-center absolute left-1/2 -translate-x-1/2" style={{ fontWeight: 900, color: 'var(--text)', fontSize: '15px', textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                    {currentChapter?.name ?? ''}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={currentIndex === (subject.chapters?.length ?? 0) - 1}
                    className={`flex items-center gap-3 font-black text-[15px]`}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 900, fontSize: '15px', color: currentIndex === (subject.chapters?.length ?? 0) - 1 ? '#cbd5e1' : 'var(--text)', background: 'transparent', border: 'none', cursor: currentIndex === (subject.chapters?.length ?? 0) - 1 ? 'not-allowed' : 'pointer' }}
                >
                    <span className="footer-btn-text">Selanjutnya</span>
                    <ChevronRight className="w-6 h-6 stroke-[3]" style={{ width: '24px', height: '24px' }} />
                </button>
            </footer>

        </div>
    );
}
