"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/auth-store";
import "./auth.css";

export default function AuthPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"login" | "daftar">("login");
  
  // Register Step State
  const [registerStep, setRegisterStep] = useState(0);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginErr, setLoginErr] = useState("");

  // Register Form State
  const [daftarFn, setDaftarFn] = useState("");
  const [daftarLn, setDaftarLn] = useState("");
  const [daftarEmail, setDaftarEmail] = useState("");
  const [daftarPw, setDaftarPw] = useState("");
  const [showDaftarPw, setShowDaftarPw] = useState(false);
  const [jenjang, setJenjang] = useState("sd");
  const [sekolah, setSekolah] = useState("");
  const [kota, setKota] = useState("");
  const [tosChecked, setTosChecked] = useState(false);
  const [newsChecked, setNewsChecked] = useState(true);

  // Password Strength
  const getStrengthScore = (v: string) => {
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    return score;
  };

  const pwScore = getStrengthScore(daftarPw);
  const pwClass = pwScore <= 1 ? "weak" : pwScore <= 2 ? "medium" : "strong";
  const pwText = daftarPw ? ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][pwScore] || "Sangat Kuat" : "";

  // Handlers
  const doLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPw) {
      setLoginErr("Email dan password wajib diisi.");
      return;
    }
    setLoginErr("");
    
    try {
      await login(loginEmail, loginPw);
      toast.success("Berhasil Masuk");
      router.push("/dashboard");
    } catch (err: any) {
      setLoginErr(err.message || "Gagal login. Silakan coba lagi.");
    }
  };

  const doDaftar = async (e: FormEvent) => {
    e.preventDefault();
    if (!tosChecked) {
      toast.error("Harap setujui Syarat & Ketentuan.");
      return;
    }
    
    if (!daftarEmail || !daftarPw || !daftarFn) {
      toast.error("Nama depan, email, dan password wajib diisi.");
      return;
    }

    try {
      const { register } = useAuthStore.getState();
      const fullName = daftarLn ? `${daftarFn} ${daftarLn}` : daftarFn;
      
      await register(daftarEmail, daftarPw, fullName);
      toast.success("Akun Berhasil Dibuat! Silakan login.");
      
      // Reset form and switch to login tab
      setDaftarEmail("");
      setDaftarPw("");
      setDaftarFn("");
      setDaftarLn("");
      setActiveTab("login");
      setRegisterStep(0);
    } catch (err: any) {
      toast.error(err.message || "Gagal mendaftar. Silakan coba lagi.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="page">
        {/* ══════════ KIRI: Brand ══════════ */}
        <aside className="brand-panel">
          <Link className="logo" href="https://www.tirtanexa.my.id">
            <div className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C9 6.5 5 9 5 13.5a7 7 0 0014 0C19 9 15 6.5 12 2z" fill="white" fillOpacity="0.9"/>
                <path d="M12 10C10.5 12.2 9.5 13.5 9.5 15a2.5 2.5 0 005 0C14.5 13.5 13.5 12.2 12 10z" fill="white" fillOpacity="0.3"/>
              </svg>
            </div>
            <span className="logo-text">Tirtanexa</span>
          </Link>

          <div className="brand-body">
            <div className="brand-badge"><span className="dot-live"></span> Platform Aktif</div>
            <h1 className="brand-headline">
              Navigasi Cerdas,<br/>Raih Impian Akademik.
              <span>Dari Madiun untuk Indonesia</span>
            </h1>
            <p className="brand-desc">Platform simulasi ujian adaptif untuk SD hingga Alumni. Ukur kemampuanmu dengan standar IRT dan analitik presisi yang jujur.</p>
            <div className="stat-grid">
              <div className="stat-card"><div className="stat-num">10.000<em>+</em></div><div className="stat-label">Soal terkurasi</div></div>
              <div className="stat-card"><div className="stat-num">99<em>%</em></div><div className="stat-label">Akurasi IRT</div></div>
              <div className="stat-card"><div className="stat-num">24<em>/7</em></div><div className="stat-label">Akses belajar</div></div>
              <div className="stat-card"><div className="stat-num">SD–SMA</div><div className="stat-label">Semua jenjang</div></div>
            </div>
          </div>

          <div className="brand-footer">© 2026 Tirtanexa · Madiun, Jawa Timur</div>
        </aside>

        {/* ══════════ KANAN: Form ══════════ */}
        <main className="form-panel">
          <div className="auth-wrap">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === "login" ? "active" : ""}`} 
                onClick={() => setActiveTab("login")}
              >
                Masuk
              </button>
              <button 
                className={`tab ${activeTab === "daftar" ? "active" : ""}`} 
                onClick={() => { setActiveTab("daftar"); setRegisterStep(0); }}
              >
                Daftar <span className="free-badge">Gratis</span>
              </button>
            </div>

            {/* ═══ LOGIN ═══ */}
            <div className={`card ${activeTab === "login" ? "visible" : ""}`} id="form-login">
              <h2 className="card-title">Selamat Datang Kembali</h2>
              <p className="card-sub">Masuk untuk melanjutkan sesi belajarmu.</p>

              <button className="btn-social" type="button">
                <svg width="17" height="17" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 7.1 29.5 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.8 18.9 13 24 13c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 7.1 29.5 5 24 5c-7.7 0-14.3 4.4-17.7 9.7z"/><path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.4 36.2 26.8 37 24 37c-5.2 0-9.7-3.3-11.3-7.8l-6.5 5C9.7 40.5 16.3 45 24 45z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C43 36.3 44 30.6 44 25c0-1.3-.1-2.6-.4-3.9z"/></svg>
                Lanjutkan dengan Google
              </button>

              <div className="divider"><span>atau dengan email</span></div>

              <div className={`alert ${loginErr ? "show" : ""}`} id="login-err">{loginErr}</div>

              <form onSubmit={doLogin}>
                <div className="field">
                  <label htmlFor="l-email">Alamat Email</label>
                  <div className="input-wrap">
                    <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg></span>
                    <input type="email" id="l-email" placeholder="email@contoh.com" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="l-pw">Password</label>
                  <div className="input-wrap">
                    <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span>
                    <input type={showLoginPw ? "text" : "password"} id="l-pw" placeholder="Masukkan password" value={loginPw} onChange={e=>setLoginPw(e.target.value)} />
                    <button type="button" className="pw-eye" style={{ color: showLoginPw ? "var(--teal)" : "" }} onClick={() => setShowLoginPw(!showLoginPw)} tabIndex={-1}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </div>

                <div className="row-end"><a href="#" onClick={(e)=>e.preventDefault()}>Lupa password?</a></div>

                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Memverifikasi...' : 'Masuk ke Tirtanexa'}
                </button>
              </form>

              <p className="form-footer">Belum punya akun? <a href="#" className="link" onClick={(e) => { e.preventDefault(); setActiveTab('daftar'); setRegisterStep(0); }}>Daftar gratis →</a></p>
            </div>

            {/* ═══ DAFTAR ═══ */}
            <div className={`card ${activeTab === "daftar" ? "visible" : ""}`} id="form-daftar">
              <div className="steps">
                <div className={`step-dot ${registerStep === 0 ? "active" : registerStep > 0 ? "done" : ""}`}></div>
                <div className={`step-dot ${registerStep === 1 ? "active" : registerStep > 1 ? "done" : ""}`}></div>
                <div className={`step-dot ${registerStep === 2 ? "active" : ""}`}></div>
              </div>

              {/* Step 0 */}
              <div style={{ display: registerStep === 0 ? "block" : "none" }}>
                <h2 className="card-title">Buat Akun Baru</h2>
                <p className="card-sub">Mulai tryout gratis, tanpa kartu kredit.</p>

                <button className="btn-social" type="button">
                  <svg width="17" height="17" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 7.1 29.5 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.8 18.9 13 24 13c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 7.1 29.5 5 24 5c-7.7 0-14.3 4.4-17.7 9.7z"/><path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.4 36.2 26.8 37 24 37c-5.2 0-9.7-3.3-11.3-7.8l-6.5 5C9.7 40.5 16.3 45 24 45z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C43 36.3 44 30.6 44 25c0-1.3-.1-2.6-.4-3.9z"/></svg>
                  Daftar dengan Google
                </button>

                <div className="divider"><span>atau dengan email</span></div>

                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label htmlFor="d-fn">Nama Depan</label>
                    <div className="input-wrap">
                      <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></span>
                      <input type="text" id="d-fn" placeholder="Andi" value={daftarFn} onChange={e=>setDaftarFn(e.target.value)} />
                    </div>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label htmlFor="d-ln">Nama Belakang</label>
                    <div className="input-wrap">
                      <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></span>
                      <input type="text" id="d-ln" placeholder="Pratama" value={daftarLn} onChange={e=>setDaftarLn(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="d-email">Alamat Email</label>
                  <div className="input-wrap">
                    <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg></span>
                    <input type="email" id="d-email" placeholder="email@contoh.com" value={daftarEmail} onChange={e=>setDaftarEmail(e.target.value)} />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="d-pw">Password</label>
                  <div className="input-wrap">
                    <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span>
                    <input type={showDaftarPw ? "text" : "password"} id="d-pw" placeholder="Min. 8 karakter" value={daftarPw} onChange={e=>setDaftarPw(e.target.value)} />
                    <button type="button" className="pw-eye" style={{ color: showDaftarPw ? "var(--teal)" : "" }} onClick={() => setShowDaftarPw(!showDaftarPw)} tabIndex={-1}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                  <div className="strength-wrap">
                    <div className="strength-bars">
                      {[1,2,3,4].map(num => (
                        <div key={num} className={`s-bar ${pwScore >= num ? pwClass : ""}`}></div>
                      ))}
                    </div>
                    <span className="strength-text" style={{ color: pwScore <= 1 ? "#f87171" : pwScore <= 2 ? "var(--orange)" : "var(--teal)" }}>
                      {pwText}
                    </span>
                  </div>
                </div>

                <button type="button" className="btn-primary" onClick={() => setRegisterStep(1)}>Lanjut →</button>
              </div>

              {/* Step 1 */}
              <div style={{ display: registerStep === 1 ? "block" : "none" }}>
                <h2 className="card-title">Pilih Jenjangmu</h2>
                <p className="card-sub">Sesuaikan dengan tingkat pendidikanmu saat ini.</p>

                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Jenjang Pendidikan</p>
                <div className="jenjang-grid">
                  {[
                    { val: "sd", icon: "📘", label: "SD" },
                    { val: "smp", icon: "📗", label: "SMP" },
                    { val: "sma", icon: "📙", label: "SMA" },
                    { val: "utbk", icon: "🎯", label: "UTBK" },
                    { val: "alumni", icon: "🎓", label: "Alumni" },
                    { val: "ortu", icon: "👨👩👧", label: "Ortu" },
                  ].map(j => (
                    <label key={j.val} className={`jenjang-label ${jenjang === j.val ? "sel" : ""}`}>
                      <input type="radio" name="jenjang" value={j.val} checked={jenjang === j.val} onChange={e=>setJenjang(e.target.value)} />
                      <div className="j-icon">{j.icon}</div>
                      <div className="j-name">{j.label}</div>
                    </label>
                  ))}
                </div>

                <div className="field">
                  <label htmlFor="d-sklh">Asal Sekolah / Instansi</label>
                  <div className="input-wrap">
                    <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
                    <input type="text" id="d-sklh" placeholder="SMAN 1 Madiun" value={sekolah} onChange={e=>setSekolah(e.target.value)} />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="d-kota">Kota / Kabupaten</label>
                  <div className="input-wrap">
                    <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
                    <input type="text" id="d-kota" placeholder="Madiun" value={kota} onChange={e=>setKota(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" className="btn-primary" style={{ background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", boxShadow: "none", flex: "0.4" }} onClick={() => setRegisterStep(0)}>← Kembali</button>
                  <button type="button" className="btn-primary" style={{ flex: "1" }} onClick={() => setRegisterStep(2)}>Lanjut →</button>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: registerStep === 2 ? "block" : "none" }}>
                <h2 className="card-title">Satu Langkah Lagi!</h2>
                <p className="card-sub">Setujui ketentuan dan aktifkan akunmu.</p>

                <div className="info-box teal"><strong>✓ Akun Gratis — Tidak perlu kartu kredit.</strong><br/>Langsung akses Tryout SD–SMA gratis. Upgrade ke Tirta-Elite kapan saja.</div>
                <div className="info-box orange"><strong>🎁 Bonus:</strong> Daftar sekarang dan dapatkan akses <strong>5 Paket Tryout Premium</strong> gratis selama 7 hari!</div>

                <form onSubmit={doDaftar}>
                  <div className="check-row">
                    <input type="checkbox" id="tos" checked={tosChecked} onChange={e=>setTosChecked(e.target.checked)} />
                    <label htmlFor="tos">Saya menyetujui <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> Tirtanexa.</label>
                  </div>
                  <div className="check-row">
                    <input type="checkbox" id="news" checked={newsChecked} onChange={e=>setNewsChecked(e.target.checked)} />
                    <label htmlFor="news">Kirim info tryout, promo, dan pembaruan fitur via email.</label>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button type="button" className="btn-primary" style={{ background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", boxShadow: "none", flex: "0.4" }} onClick={() => setRegisterStep(1)}>←</button>
                    <button type="submit" className="btn-primary orange" style={{ flex: "1" }}>Buat Akun Sekarang</button>
                  </div>
                </form>
              </div>

              <p className="form-footer">Sudah punya akun? <a href="#" className="link" onClick={(e) => { e.preventDefault(); setActiveTab('login'); }}>Masuk →</a></p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
