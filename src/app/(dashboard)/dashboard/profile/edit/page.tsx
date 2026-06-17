"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [city, setCity] = useState("");
  const [grade, setGrade] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.studentProfile?.phone || "");
      setSchool(user.studentProfile?.school || "");
      setCity(user.studentProfile?.city || "");
      setGrade(user.studentProfile?.grade || "");
      
      // format birthDate to YYYY-MM-DD
      if (user.studentProfile?.birthDate) {
        const d = new Date(user.studentProfile.birthDate);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        setBirthDate(`${yyyy}-${mm}-${dd}`);
      }
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data: any = { fullName };
      if (user.role === "STUDENT") {
        data.phone = phone || null;
        data.school = school || null;
        data.city = city || null;
        data.grade = grade || null;
        data.birthDate = birthDate || null;
      }

      const updatedUser = await api.auth.updateProfile(data);
      setUser({ ...user, ...updatedUser });
      router.push("/dashboard/profile");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan profil");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok dengan password baru");
      return;
    }

    setLoadingPassword(true);
    try {
      await api.auth.changePassword({ oldPassword, newPassword });
      setPasswordSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "Gagal mengubah password");
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!user) return null;

  const isStudent = user.role === "STUDENT";

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* BACK */}
      <Link href="/dashboard/profile" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-5 transition-colors w-fit">
        <ChevronLeft size={18} /> Kembali
      </Link>

      <form onSubmit={handleSave} className="space-y-5">
        {/* PERSONAL INFO */}
        <section className="bg-[var(--surface)] border border-[var(--border-hover)] rounded-2xl p-5">
          <h2 className="font-bold text-[var(--text)] mb-4 text-[15px]">Informasi Pribadi</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Masukkan nama" 
                className="w-full rounded-lg border border-[var(--border-hover)] focus:border-teal-500 p-2" 
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">Email (Tidak dapat diubah)</label>
              <input 
                type="email" 
                value={user.email} 
                disabled
                className="w-full rounded-lg border border-[var(--border-hover)] bg-[var(--bg-alt)] text-[var(--text-muted)] p-2" 
              />
            </div>

            {isStudent && (
              <>
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">No Telepon</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx" 
                    className="w-full rounded-lg border border-[var(--border-hover)] focus:border-teal-500 p-2" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">Tanggal Lahir</label>
                  <input 
                    type="date" 
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-hover)] focus:border-teal-500 p-2" 
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* SCHOOL INFO (STUDENT ONLY) */}
        {isStudent && (
          <section className="bg-[var(--surface)] border border-[var(--border-hover)] rounded-2xl p-5">
            <h2 className="font-bold text-[var(--text)] mb-4 text-[15px]">Informasi Sekolah</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">Asal Sekolah</label>
                <input 
                  type="text" 
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                  placeholder="Nama sekolah" 
                  className="w-full rounded-lg border border-[var(--border-hover)] focus:border-teal-500 p-2" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">Kota / Kabupaten Domisili</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Misal: Jakarta Selatan" 
                  className="w-full rounded-lg border border-[var(--border-hover)] focus:border-teal-500 p-2" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">Kelas / Tingkat</label>
                <input 
                  type="text" 
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  placeholder="Misal: Kelas 12 IPA" 
                  className="w-full rounded-lg border border-[var(--border-hover)] focus:border-teal-500 p-2" 
                />
              </div>
            </div>
          </section>
        )}

        <div className="flex justify-end gap-4 pt-2">
          <Link href="/dashboard/profile" className="bg-[var(--bg-alt)] hover:bg-slate-200 text-[var(--text-secondary)] rounded-xl px-5 py-2 font-bold transition-colors">
            Batal
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-orange-400 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl px-5 py-2 font-bold flex items-center gap-2 transition-colors"
          >
            <Save size={18} />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      {/* PASSWORD SECTION */}
      <form onSubmit={handlePasswordSave} className="mt-8">
        <section className="bg-[var(--surface)] border border-[var(--border-hover)] rounded-2xl p-5">
          <h2 className="font-bold text-[var(--text)] mb-4 text-[15px]">Ganti Password</h2>
          
          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="mb-4 p-3 bg-teal-50 text-teal-700 rounded-xl text-sm border border-teal-200">
              Password berhasil diubah.
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">Password Saat Ini</label>
              <input 
                type="password" 
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-hover)] focus:border-teal-500 p-2" 
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">Password Baru</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-hover)] focus:border-teal-500 p-2" 
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">Konfirmasi Password Baru</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-hover)] focus:border-teal-500 p-2" 
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loadingPassword}
              className="bg-orange-400 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl px-5 py-2 font-bold mt-2 transition-colors"
            >
              {loadingPassword ? "Menyimpan..." : "Ganti Password"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
