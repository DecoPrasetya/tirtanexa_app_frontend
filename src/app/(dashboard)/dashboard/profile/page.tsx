"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Pencil,
  User,
  Mail,
  Shield,
  Calendar,
  Save,
  Moon,
  Sun,
  Route
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Logic simpan profil
    setTimeout(() => setSaving(false), 1000);
  };

  const roleBadge = {
    STUDENT: "teal" as const,
    TEACHER: "info" as const,
    ADMIN: "orange" as const,
  };

  const campusChoices = [
    { label: "Pilihan 1", value: "Universitas Indonesia - Teknik Informatika" },
    { label: "Pilihan 2", value: "Institut Teknologi Bandung - Sekolah Teknik Elektro & Informatika" },
  ];

  return (
    <div className="w-full flex justify-center px-4 md:px-8 py-6 pb-24">

      {/* CONTAINER */}
      <div className="w-full max-w-4xl flex flex-col gap-6">

        {/* ================= PREMIUM ================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl lg:rounded-[24px] border border-[#20b8ae] bg-[#3ecdc3] shadow-sm overflow-hidden p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              {/* LEFT */}
              <div className="flex flex-col sm:flex-row sm:items-center md:items-start gap-4">

                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                  <Crown size={24} className="text-white" />
                </div>

                <div className="space-y-1.5 text-center sm:text-left">

                  <h2 className="font-bold text-white text-xl sm:text-2xl leading-none">
                    Upgrade Premium
                  </h2>

                  <p className="text-white/90 leading-relaxed text-xs sm:text-sm max-w-[500px]">
                    Akses penuh ke tryout premium, pembahasan lengkap, video pembelajaran, ranking nasional, dan materi belajar.
                  </p>
                </div>
              </div>

              {/* BUTTON */}
              <button className="bg-[#ff8c2b] hover:bg-[#ff7a0f] transition-all duration-300 rounded-xl font-bold text-white w-full md:w-fit whitespace-nowrap px-5 py-3 text-sm shrink-0">
                Upgrade Sekarang
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= PROFILE ================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card
            className="rounded-2xl lg:rounded-[24px] border border-[var(--border)] shadow-sm"
            padding="none"
          >

            {/* TOP */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 p-5 sm:p-6 md:p-8">

              {/* PROFILE */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">

                {/* AVATAR */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] gradient-teal flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-lg shrink-0 mx-auto sm:mx-0">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* TEXT */}
                <div className="space-y-2 text-center sm:text-left flex flex-col items-center sm:items-start">

                  <div>
                    <h1 className="font-bold text-[var(--text)] text-2xl sm:text-3xl leading-none mb-1 sm:mb-2">
                      {user?.fullName || "User"}
                    </h1>

                    <p className="text-[var(--text-muted)] text-xs sm:text-sm">
                      {user?.email}
                    </p>
                  </div>

                  <Badge
                    variant={
                      roleBadge[user?.role || "STUDENT"]
                    }
                  >
                    {user?.role}
                  </Badge>
                </div>
              </div>

              {/* BUTTON */}
              <Link href="/dashboard/profile/edit" className="w-full md:w-fit shrink-0 block">
                <Button
                  leftIcon={<Pencil size={14} />}
                  className="rounded-xl h-10 sm:h-11 px-5 text-sm w-full"
                >
                  Edit Profil
                </Button>
              </Link>
            </div>

            {/* FORM */}
            <div className="border-t border-[var(--border)] p-5 sm:p-6 md:p-8">

              <div className="max-w-3xl mx-auto space-y-5">

                {/* INPUT */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                    Nama Lengkap
                  </label>

                  <div className="rounded-xl overflow-hidden">
                    <Input
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      leftIcon={<User size={16} />}
                      className="h-10 sm:h-11 text-sm"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                    Email
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3 sm:p-3.5 w-full">
                    <Mail
                      size={16}
                      className="text-[var(--text-muted)] shrink-0"
                    />
                    <span className="text-sm text-[var(--text-secondary)] truncate">
                      {user?.email}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-[var(--text-muted)] pl-1">
                    Email tidak dapat diubah
                  </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                  {/* ROLE */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                      Role
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3 sm:p-3.5">
                      <Shield
                        size={16}
                        className="text-[var(--text-muted)] shrink-0"
                      />
                      <span className="text-sm capitalize text-[var(--text-secondary)] truncate">
                        {user?.role?.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  {/* DATE */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                      Bergabung
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3 sm:p-3.5">
                      <Calendar
                        size={16}
                        className="text-[var(--text-muted)] shrink-0"
                      />
                      <span className="text-sm text-[var(--text-secondary)] truncate">
                        {user?.createdAt
                          ? new Date(
                            user.createdAt
                          ).toLocaleDateString("id-ID")
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SAVE */}
                <div className="pt-2">
                  <Button
                    isLoading={saving}
                    onClick={handleSave}
                    leftIcon={<Save size={16} />}
                    className="rounded-xl h-10 sm:h-11 px-6 text-sm w-full sm:w-fit"
                  >
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ================= AKTIVITAS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            className="rounded-2xl lg:rounded-[24px] border border-[var(--border)] shadow-sm"
            padding="none"
          >

            <div className="p-5 sm:p-6 md:p-8">

              {/* HEADER */}
              <div className="mb-5 sm:mb-6">

                <h2 className="font-bold text-[var(--text)] text-lg sm:text-xl md:text-2xl mb-1 sm:mb-1.5">
                  Aktivitas Terkini
                </h2>

                <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                  Riwayat belajar dan progres terbaru kamu.
                </p>
              </div>

              {/* LIST */}
              <div className="space-y-3">

                {[
                  {
                    title:
                      "Menyelesaikan Tryout SNBT 2026",
                    time: "2 jam yang lalu",
                  },
                  {
                    title:
                      "Belajar Bab Trigonometri",
                    time: "Kemarin • 19:30",
                  },
                  {
                    title:
                      "Mengerjakan Quiz Penalaran Umum",
                    time: "3 hari yang lalu",
                  },
                ].map((item, idx) => (

                  <div
                    key={idx}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-white transition-all duration-300 p-4"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                      <div className="flex items-start gap-3">

                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[var(--teal)] mt-1.5 shrink-0" />

                        <div className="space-y-1">

                          <h3 className="font-semibold text-sm leading-snug text-[var(--text)]">
                            {item.title}
                          </h3>

                          <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                            {item.time}
                          </p>
                        </div>
                      </div>

                      <button className="text-[13px] sm:text-sm font-bold text-[var(--teal)] hover:underline shrink-0 sm:self-center ml-[20px] sm:ml-0">
                        Lihat
                      </button>
                    </div>
                  </div>

                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ================= KAMPUS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card
            className="rounded-2xl lg:rounded-[24px] overflow-hidden border border-[var(--border)] shadow-sm"
            padding="none"
          >

            {/* HEADER */}
            <div className="border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 md:p-8">

              <div>
                <h2 className="font-bold text-[var(--text)] text-lg sm:text-xl md:text-2xl mb-1 sm:mb-1.5">
                  Kampus dan Prodi
                </h2>

                <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                  Target kampus dan program studi kamu.
                </p>
              </div>

              <Link href="/dashboard/profile/edit" className="w-full sm:w-fit block">
                <Button leftIcon={<Pencil size={14} />} className="rounded-xl h-10 sm:h-11 px-5 text-sm w-full">
                  Ubah
                </Button>
              </Link>
            </div>

            {/* LIST */}
            <div>

              {campusChoices.map((item, idx) => (

                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6 border-b border-[var(--border)] p-4 sm:p-5 md:p-6 ${idx === campusChoices.length - 1
                    ? "border-b-0"
                    : ""
                    }`}
                >

                  <div className="font-bold text-xs sm:text-sm text-[var(--text-muted)] sm:w-28 shrink-0">
                    {item.label}
                  </div>

                  <div className="font-semibold text-sm leading-snug text-[var(--text)] mt-1 sm:mt-0">
                    {item.value}
                  </div>
                </div>

              ))}
            </div>
          </Card>
        </motion.div>

        {/* ================= TEMA ================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            className="rounded-2xl lg:rounded-[24px] border border-[var(--border)] shadow-sm"
            padding="none"
          >

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 md:p-8">

              <div>

                <h2 className="font-bold text-[var(--text)] text-lg sm:text-xl md:text-2xl mb-1 sm:mb-1.5">
                  Tema
                </h2>

                <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                  Atur tampilan aplikasi sesuai preferensi kamu.
                </p>
              </div>

              {/* SWITCH */}
              <button
                onClick={() =>
                  setDarkMode(!darkMode)
                }
                className={`w-16 sm:w-[72px] h-8 sm:h-10 rounded-full transition-all duration-300 flex p-1 shrink-0 self-start sm:self-center ${darkMode
                  ? "bg-slate-800 justify-end"
                  : "bg-slate-200 justify-start"
                  }`}
              >

                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-md flex items-center justify-center shrink-0">
                  {darkMode ? (
                    <Moon
                      size={14}
                      className="text-slate-700 sm:w-4 sm:h-4"
                    />
                  ) : (
                    <Sun
                      size={14}
                      className="text-yellow-500 sm:w-4 sm:h-4"
                    />
                  )}
                </div>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}