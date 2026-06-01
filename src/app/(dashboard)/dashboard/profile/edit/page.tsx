"use client";

import { useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const [campusChoices, setCampusChoices] = useState([
    { university: "", major: "" },
    { university: "", major: "" },
  ]);

  const universities = [
    "Universitas Indonesia",
    "Universitas Gadjah Mada",
    "Institut Teknologi Bandung",
    "Universitas Sebelas Maret",
    "Politeknik Negeri Madiun",
  ];
  const majors = [
    "Teknik Informatika",
    "Sains Data",
    "Sistem Informasi",
    "Teknik Elektro",
    "Manajemen",
  ];
  const provinces = ["Jawa Timur", "Jawa Tengah", "DKI Jakarta", "Jawa Barat"];
  const cities = ["Madiun", "Surabaya", "Solo", "Bandung"];

  const addChoice = () => setCampusChoices([...campusChoices, { university: "", major: "" }]);
  const removeChoice = (i: number) => setCampusChoices(campusChoices.filter((_, idx) => idx !== i));

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* BACK */}
      <Link href="/dashboard/profile" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-5 transition-colors">
        <ChevronLeft size={18} /> Kembali
      </Link>

      <div className="space-y-5">
        {/* PERSONAL INFO */}
        <section className="bg-white border border-slate-300 rounded-2xl p-5">
          <h2 className="font-bold text-slate-800 mb-4 text-[15px]">Informasi Pribadi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">Nama</label>
              <input type="text" placeholder="Masukkan nama" className="w-full rounded-lg border border-slate-300 focus:border-teal-500 p-2" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">No Telepon</label>
              <input type="text" placeholder="08xxxxxxxxxx" className="w-full rounded-lg border border-slate-300 focus:border-teal-500 p-2" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">Email</label>
              <input type="email" placeholder="user@gmail.com" className="w-full rounded-lg border border-slate-300 focus:border-teal-500 p-2" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">Jenis Kelamin</label>
              <select className="w-full rounded-lg border border-slate-300 focus:border-teal-500 bg-white p-2">
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>
          </div>
        </section>

        {/* SCHOOL INFO */}
        <section className="bg-white border border-slate-300 rounded-2xl p-5">
          <h2 className="font-bold text-slate-800 mb-4 text-[15px]">Sekolah</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">Provinsi</label>
              <select className="w-full rounded-lg border border-slate-300 focus:border-teal-500 bg-white p-2">
                {provinces.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">Kota/Kabupaten</label>
              <select className="w-full rounded-lg border border-slate-300 focus:border-teal-500 bg-white p-2">
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">Sekolah</label>
              <input type="text" placeholder="Nama sekolah" className="w-full rounded-lg border border-slate-300 focus:border-teal-500 p-2" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">Jurusan</label>
              <select className="w-full rounded-lg border border-slate-300 focus:border-teal-500 bg-white p-2">
                <option>IPA</option>
                <option>IPS</option>
                <option>Bahasa</option>
              </select>
            </div>
          </div>
        </section>

        {/* CAMPUS CHOICES */}
        <section className="bg-white border border-slate-300 rounded-2xl p-5">
          <h2 className="font-bold text-slate-800 mb-4 text-[15px]">Pilihan Kampus & Prodi</h2>
          {campusChoices.map((c, i) => (
            <div key={i} className="border border-slate-300 rounded-2xl bg-slate-50 p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800 text-[14px]">Pilihan {i + 1}</h3>
                {i > 0 && (
                  <button onClick={() => removeChoice(i)} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm">
                    <Trash2 size={15} /> Hapus
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-1">Perguruan Tinggi</label>
                  <select className="w-full rounded-lg border border-slate-300 bg-white focus:border-teal-500 p-2">
                    <option>Pilih Universitas</option>
                    {universities.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-1">Program Studi</label>
                  <select className="w-full rounded-lg border border-slate-300 bg-white focus:border-teal-500 p-2">
                    <option>Pilih Program Studi</option>
                    {majors.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addChoice} className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl py-2 font-bold flex items-center justify-center gap-2 mb-4">
            <Plus size={18} /> Tambah Pilihan
          </button>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard/profile" className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 py-2 font-bold">Batal</Link>
            <button className="bg-orange-400 hover:bg-orange-500 text-white rounded-xl px-5 py-2 font-bold">Simpan</button>
          </div>
        </section>

        {/* PASSWORD */}
        <section className="bg-white border border-slate-300 rounded-2xl p-5">
          <h2 className="font-bold text-slate-800 mb-4 text-[15px]">Ganti Password</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">Password Saat Ini</label>
              <input type="password" className="w-full rounded-lg border border-slate-300 focus:border-teal-500 p-2" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">Password Baru</label>
              <input type="password" className="w-full rounded-lg border border-slate-300 focus:border-teal-500 p-2" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-2">Konfirmasi Password</label>
              <input type="password" className="w-full rounded-lg border border-slate-300 focus:border-teal-500 p-2" />
            </div>
            <button className="bg-orange-400 hover:bg-orange-500 text-white rounded-xl px-5 py-2 font-bold mt-2">Simpan</button>
          </div>
        </section>

        {/* DELETE ACCOUNT */}
        <section className="border border-red-300 bg-red-50 rounded-2xl flex items-center justify-between p-4">
          <div>
            <h3 className="font-bold text-red-600 text-sm mb-1">Hapus Akun</h3>
            <p className="text-red-400 text-[12px]">Menghapus akun akan menghilangkan akses ke seluruh data dan riwayat. Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2 font-bold">Hapus</button>
        </section>
      </div>
    </div>
  );
}
