"use client";

import { useState } from "react";
import {
    ChevronLeft,
    Plus,
    Trash2,
} from "lucide-react";

export default function EditProfilePage() {
    const [campusChoices, setCampusChoices] = useState([
        {
            university: "",
            major: "",
        },
        {
            university: "",
            major: "",
        },
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

    const provinces = [
        "Jawa Timur",
        "Jawa Tengah",
        "DKI Jakarta",
        "Jawa Barat",
    ];

    const cities = [
        "Madiun",
        "Surabaya",
        "Solo",
        "Bandung",
    ];

    const addChoice = () => {
        setCampusChoices([
            ...campusChoices,
            {
                university: "",
                major: "",
            },
        ]);
    };

    const removeChoice = (index: number) => {
        const updated = [...campusChoices];
        updated.splice(index, 1);
        setCampusChoices(updated);
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">

            {/* BACK */}
            <button className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-5 transition-colors">
                <ChevronLeft size={18} />
                Kembali
            </button>

            <div className="space-y-5">

                {/* INFORMASI PRIBADI */}
                <div
                    className="bg-white border border-slate-300 rounded-2xl"
                    style={{
                        padding: "20px",
                    }}
                >
                    <h2
                        className="font-bold text-slate-800"
                        style={{
                            fontSize: "15px",
                            marginBottom: "20px",
                        }}
                    >
                        Informasi Pribadi
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* NAMA */}
                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                Nama
                            </label>

                            <input
                                type="text"
                                placeholder="Masukkan nama"
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                                style={{
                                    padding: "10px 12px",
                                }}
                            />
                        </div>

                        {/* TELEPON */}
                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                No Telepon
                            </label>

                            <input
                                type="text"
                                placeholder="08xxxxxxxxxx"
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                                style={{
                                    padding: "10px 12px",
                                }}
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="user@gmail.com"
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                                style={{
                                    padding: "10px 12px",
                                }}
                            />
                        </div>

                        {/* JK */}
                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                Jenis Kelamin
                            </label>

                            <select
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500 bg-white"
                                style={{
                                    padding: "10px 12px",
                                }}
                            >
                                <option>Laki-laki</option>
                                <option>Perempuan</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* SEKOLAH */}
                <div
                    className="bg-white border border-slate-300 rounded-2xl"
                    style={{
                        padding: "20px",
                    }}
                >
                    <h2
                        className="font-bold text-slate-800"
                        style={{
                            fontSize: "15px",
                            marginBottom: "20px",
                        }}
                    >
                        Sekolah
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* PROVINSI */}
                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                Provinsi
                            </label>

                            <select
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500 bg-white"
                                style={{
                                    padding: "10px 12px",
                                }}
                            >
                                {provinces.map((item) => (
                                    <option key={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* KOTA */}
                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                Kota/Kabupaten
                            </label>

                            <select
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500 bg-white"
                                style={{
                                    padding: "10px 12px",
                                }}
                            >
                                {cities.map((item) => (
                                    <option key={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SEKOLAH */}
                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                Sekolah
                            </label>

                            <input
                                type="text"
                                placeholder="Nama sekolah"
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                                style={{
                                    padding: "10px 12px",
                                }}
                            />
                        </div>

                        {/* JURUSAN */}
                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                Jurusan
                            </label>

                            <select
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500 bg-white"
                                style={{
                                    padding: "10px 12px",
                                }}
                            >
                                <option>IPA</option>
                                <option>IPS</option>
                                <option>Bahasa</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* PILIHAN */}
                <div
                    className="bg-white border border-slate-300 rounded-2xl"
                    style={{
                        padding: "20px",
                    }}
                >

                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-slate-800 text-[15px]">
                            Pilihan Kampus & Prodi
                        </h2>
                    </div>

                    <div className="space-y-5">

                        {campusChoices.map((item, index) => (

                            <div
                                key={index}
                                className="border border-slate-300 rounded-2xl bg-slate-50"
                                style={{
                                    padding: "18px",
                                }}
                            >

                                {/* TOP */}
                                <div className="flex items-center justify-between mb-5">

                                    <h3 className="font-bold text-slate-800 text-[14px]">
                                        Pilihan {index + 1}
                                    </h3>

                                    {index > 0 && (
                                        <button
                                            onClick={() =>
                                                removeChoice(index)
                                            }
                                            className="text-red-500 hover:text-red-600 font-semibold text-sm flex items-center gap-1"
                                        >
                                            <Trash2 size={15} />
                                            Hapus
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">

                                    {/* PT */}
                                    <div>
                                        <label className="block text-[12px] font-semibold text-slate-500 mb-2">
                                            Perguruan Tinggi
                                        </label>

                                        <select
                                            className="w-full rounded-lg border border-slate-300 bg-white outline-none focus:border-teal-500"
                                            style={{
                                                padding: "10px 12px",
                                            }}
                                        >
                                            <option>
                                                Pilih Universitas
                                            </option>

                                            {universities.map((u) => (
                                                <option key={u}>
                                                    {u}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* PRODI */}
                                    <div>
                                        <label className="block text-[12px] font-semibold text-slate-500 mb-2">
                                            Program Studi
                                        </label>

                                        <select
                                            className="w-full rounded-lg border border-slate-300 bg-white outline-none focus:border-teal-500"
                                            style={{
                                                padding: "10px 12px",
                                            }}
                                        >
                                            <option>
                                                Pilih Program Studi
                                            </option>

                                            {majors.map((m) => (
                                                <option key={m}>
                                                    {m}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                            </div>

                        ))}

                        {/* TAMBAH */}
                        <button
                            onClick={addChoice}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                            style={{
                                padding: "12px",
                                fontSize: "14px",
                            }}
                        >
                            <Plus size={18} />
                            Tambah Pilihan
                        </button>

                        {/* BUTTON */}
                        <div className="flex items-center justify-center gap-4 pt-2">

                            <button
                                className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
                                style={{
                                    padding: "10px 26px",
                                    fontSize: "13px",
                                }}
                            >
                                Batal
                            </button>

                            <button
                                className="bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-bold transition-all"
                                style={{
                                    padding: "10px 26px",
                                    fontSize: "13px",
                                }}
                            >
                                Simpan
                            </button>

                        </div>
                    </div>
                </div>

                {/* PASSWORD */}
                <div
                    className="bg-white border border-slate-300 rounded-2xl"
                    style={{
                        padding: "20px",
                    }}
                >

                    <div className="flex items-center justify-between mb-6">

                        <h2 className="font-bold text-slate-800 text-[15px]">
                            Ganti Password
                        </h2>

                        <button
                            className="bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-bold transition-all"
                            style={{
                                padding: "8px 18px",
                                fontSize: "12px",
                            }}
                        >
                            Simpan
                        </button>

                    </div>

                    <div className="space-y-4">

                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                Password Saat Ini
                            </label>

                            <input
                                type="password"
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                                style={{
                                    padding: "10px 12px",
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                Password Baru
                            </label>

                            <input
                                type="password"
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                                style={{
                                    padding: "10px 12px",
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                                Konfirmasi Password
                            </label>

                            <input
                                type="password"
                                className="w-full rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                                style={{
                                    padding: "10px 12px",
                                }}
                            />
                        </div>

                    </div>
                </div>

                {/* DELETE */}
                <div
                    className="border border-red-300 bg-red-50 rounded-2xl flex items-center justify-between gap-5"
                    style={{
                        padding: "18px 20px",
                    }}
                >

                    <div>
                        <h3 className="font-bold text-red-600 text-sm mb-1">
                            Hapus Akun
                        </h3>

                        <p className="text-[12px] text-red-400 leading-relaxed">
                            Menghapus akun akan menghilangkan akses ke seluruh data dan riwayat.
                            Tindakan ini tidak bisa dibatalkan.
                        </p>
                    </div>

                    <button
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shrink-0"
                        style={{
                            padding: "10px 22px",
                            fontSize: "13px",
                        }}
                    >
                        Hapus
                    </button>
                </div>

            </div>
        </div>
    );
}