"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, UserRound, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuthStore } from "@/lib/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Nama lengkap wajib diisi";
    if (!email) e.email = "Email wajib diisi";
    else if (!/\\S+@\\S+\\.\\S+/.test(email)) e.email = "Format email tidak valid";
    if (!password) e.password = "Password wajib diisi";
    else if (password.length < 6) e.password = "Password minimal 6 karakter";
    if (password !== confirmPassword) e.confirmPassword = "Password tidak cocok";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await register(email, password, fullName);
      toast.success("Akun berhasil dibuat! Silakan login.");
      router.push("/login");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mendaftar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 py-12">
      {/* ===== DYNAMIC BACKGROUND ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orange Orb */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[5%] -right-[10%] w-[550px] h-[550px] rounded-full bg-[var(--orange)]/20 blur-[100px]"
        />
        
        {/* Teal Orb */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute -bottom-[5%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[var(--teal)]/20 blur-[120px]"
        />
      </div>

      {/* ===== CENTERED CARD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-[95%] max-w-[640px]"
      >
        <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] py-12 px-8 sm:py-16 sm:px-28 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--orange)] to-[var(--orange-dark)] flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-orange-500/20 mb-5"
            >
              T
            </motion.div>
            <h1 className="text-[28px] font-bold text-[var(--text)] tracking-tight mb-2">
              Buat Akun Baru ✨
            </h1>
            <p className="text-[15px] text-[var(--text-muted)] leading-relaxed">
              Bergabung bersama ribuan pelajar lainnya di <span className="font-semibold text-[var(--orange)]">Tirtanexa</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Input
                label="Nama Lengkap"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                leftIcon={<UserRound size={18} className="text-[var(--text-muted)]" />}
                id="register-name"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Input
                label="Email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                leftIcon={<Mail size={18} className="text-[var(--text-muted)]" />}
                id="register-email"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Input
                label="Password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<Lock size={18} className="text-[var(--text-muted)]" />}
                id="register-password"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Input
                label="Konfirmasi Password"
                type="password"
                placeholder="Ketik ulang password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                leftIcon={<Lock size={18} className="text-[var(--text-muted)]" />}
                id="register-confirm"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="pt-4 flex justify-center"
            >
              <Button
                type="submit"
                variant="accent"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight size={18} />}
                id="register-submit"
                className="w-[65%] min-h-[56px] shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300"
              >
                Daftar Sekarang
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-8 text-center text-[14px] text-[var(--text-muted)]"
          >
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-[var(--teal)] hover:text-[var(--teal-dark)] transition-colors">
              Masuk
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
