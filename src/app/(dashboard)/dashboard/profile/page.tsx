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
  Route,
  Link
} from "lucide-react";
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
    <div className="w-full flex justify-center px-4 py-10">

      {/* CONTAINER */}
      <div className="w-full max-w-5xl flex flex-col gap-8">

        {/* ================= PREMIUM ================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-[32px] border border-[#20b8ae] bg-[#3ecdc3] shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">

              {/* LEFT */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">

                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Crown size={30} className="text-white" />
                </div>

                <div className="space-y-3 text-center sm:text-left">

                  <h2 className="font-black text-white text-3xl sm:text-4xl leading-none">
                    Upgrade Premium
                  </h2>

                  <p className="text-white/90 leading-relaxed text-sm sm:text-base max-w-[680px]">
                    Akses penuh ke tryout premium,
                    pembahasan lengkap, video pembelajaran,
                    ranking nasional, dan seluruh materi belajar.
                  </p>
                </div>
              </div>

              {/* BUTTON */}
              <button className="bg-[#ff8c2b] hover:bg-[#ff7a0f] transition-all duration-300 rounded-2xl font-bold text-white w-full lg:w-fit whitespace-nowrap px-6 py-4 text-sm sm:text-base shrink-0">
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
            className="rounded-[32px] border border-[var(--border)] shadow-sm"
            padding="none"
          >

            {/* TOP */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10">

              {/* PROFILE */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">

                {/* AVATAR */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[34px] gradient-teal flex items-center justify-center text-white text-4xl sm:text-5xl font-black shadow-lg shrink-0 mx-auto sm:mx-0">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* TEXT */}
                <div className="space-y-3 text-center sm:text-left flex flex-col items-center sm:items-start">

                  <div>
                    <h1 className="font-black text-[var(--text)] text-3xl sm:text-4xl lg:text-5xl leading-none mb-2 sm:mb-3">
                      {user?.fullName || "User"}
                    </h1>

                    <p className="text-[var(--text-muted)] text-sm sm:text-base">
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
              <Link href="/dashboard/profile/edit" className="w-full lg:w-fit shrink-0 block">
                <Button
                  leftIcon={<Pencil size={16} />}
                  className="rounded-2xl h-12 sm:h-[52px] px-6 w-full"
                >
                  Edit Profil
                </Button>
              </Link>
            </div>

            {/* FORM */}
            <div className="border-t border-[var(--border)] p-6 sm:p-8 lg:p-10">

              <div className="max-w-3xl mx-auto space-y-6">

                {/* INPUT */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">
                    Nama Lengkap
                  </label>

                  <div className="rounded-2xl overflow-hidden">
                    <Input
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      leftIcon={<User size={18} />}
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">
                    Email
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 sm:p-[16px_18px] w-full">
                    <Mail
                      size={18}
                      className="text-[var(--text-muted)] shrink-0"
                    />
                    <span className="text-sm text-[var(--text-secondary)] truncate">
                      {user?.email}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] pl-1">
                    Email tidak dapat diubah
                  </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* ROLE */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-secondary)]">
                      Role
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 sm:p-[16px_18px]">
                      <Shield
                        size={18}
                        className="text-[var(--text-muted)] shrink-0"
                      />
                      <span className="text-sm capitalize text-[var(--text-secondary)] truncate">
                        {user?.role?.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  {/* DATE */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-secondary)]">
                      Bergabung
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 sm:p-[16px_18px]">
                      <Calendar
                        size={18}
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
                    className="rounded-2xl h-12 sm:h-[52px] px-6 sm:px-7 w-full sm:w-fit"
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
            className="rounded-[32px] border border-[var(--border)] shadow-sm"
            padding="none"
          >

            <div className="p-6 sm:p-8 lg:p-10">

              {/* HEADER */}
              <div className="mb-6 sm:mb-8">

                <h2 className="font-black text-[var(--text)] text-2xl sm:text-3xl mb-2">
                  Aktivitas Terkini
                </h2>

                <p className="text-sm sm:text-base text-[var(--text-muted)]">
                  Riwayat belajar dan progres terbaru kamu.
                </p>
              </div>

              {/* LIST */}
              <div className="space-y-4">

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
                    className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-white transition-all duration-300 p-4 sm:p-5"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                      <div className="flex items-start gap-3 sm:gap-4">

                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[var(--teal)] mt-1.5 sm:mt-2 shrink-0" />

                        <div className="space-y-1 sm:space-y-2">

                          <h3 className="font-semibold text-sm sm:text-[15px] leading-snug sm:leading-relaxed text-[var(--text)]">
                            {item.title}
                          </h3>

                          <p className="text-xs text-[var(--text-muted)]">
                            {item.time}
                          </p>
                        </div>
                      </div>

                      <button className="text-sm font-bold text-[var(--teal)] hover:underline shrink-0 sm:self-center ml-[22px] sm:ml-0">
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
            className="rounded-[32px] overflow-hidden border border-[var(--border)] shadow-sm"
            padding="none"
          >

            {/* HEADER */}
            <div className="border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-6 sm:p-8 lg:p-10">

              <div>
                <h2 className="font-black text-[var(--text)] text-2xl sm:text-3xl mb-2">
                  Kampus dan Prodi
                </h2>

                <p className="text-sm sm:text-base text-[var(--text-muted)]">
                  Target kampus dan program studi kamu.
                </p>
              </div>

              <Link href="/dashboard/profile/edit" className="w-full sm:w-fit block">
                <Button leftIcon={<Pencil size={16} />} className="rounded-2xl h-10 sm:h-[50px] px-5 sm:px-6 w-full">
                  Ubah
                </Button>
              </Link>
            </div>

            {/* LIST */}
            <div>

              {campusChoices.map((item, idx) => (

                <div
                  key={idx}
                  className={`flex flex-col lg:flex-row lg:items-start gap-2 lg:gap-8 border-b border-[var(--border)] p-5 sm:p-6 lg:p-8 ${idx === campusChoices.length - 1
                    ? "border-b-0"
                    : ""
                    }`}
                >

                  <div className="font-bold text-xs sm:text-sm text-[var(--text-muted)] lg:w-32 shrink-0">
                    {item.label}
                  </div>

                  <div className="font-semibold text-sm sm:text-base leading-snug sm:leading-relaxed text-[var(--text)]">
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
            className="rounded-[32px] border border-[var(--border)] shadow-sm"
            padding="none"
          >

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-6 sm:p-8 lg:p-10">

              <div>

                <h2 className="font-black text-[var(--text)] text-2xl sm:text-3xl mb-2">
                  Tema
                </h2>

                <p className="text-sm sm:text-base text-[var(--text-muted)]">
                  Atur tampilan aplikasi sesuai preferensi kamu.
                </p>
              </div>

              {/* SWITCH */}
              <button
                onClick={() =>
                  setDarkMode(!darkMode)
                }
                className={`w-20 sm:w-[84px] h-10 sm:h-[44px] rounded-full transition-all duration-300 flex p-1 sm:p-[5px] shrink-0 self-start sm:self-center ${darkMode
                  ? "bg-slate-800 justify-end"
                  : "bg-slate-200 justify-start"
                  }`}
              >

                <div className="w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full bg-white shadow-md flex items-center justify-center shrink-0">
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