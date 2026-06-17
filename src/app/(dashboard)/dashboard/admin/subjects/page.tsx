"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Layers,
  BookOpen,
  ChevronDown,
  BrainCircuit,
  Calculator,
  Landmark,
  FlaskConical,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { Subject } from "@/lib/types";

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("UTBK");
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    api.subjects
      .getAll()
      .then((d) => setSubjects(Array.isArray(d) ? d : []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);



  const categories = ["UTBK", "SMA", "SMP", "SD"];

  const filteredSubjects = subjects.filter(
    (s) => s.category === selectedCategory
  );

  const catBadge = {
    UTBK: "orange" as const,
    SD: "success" as const,
    SMP: "info" as const,
    SMA: "teal" as const,
  };

  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("mat")) {
      return <Calculator className="w-6 h-6 text-violet-500" />;
    }

    if (name.toLowerCase().includes("bahasa")) {
      return <BookOpen className="w-6 h-6 text-violet-500" />;
    }

    if (name.toLowerCase().includes("sejarah")) {
      return <Landmark className="w-6 h-6 text-violet-500" />;
    }

    if (
      name.toLowerCase().includes("fisika") ||
      name.toLowerCase().includes("kimia") ||
      name.toLowerCase().includes("biologi")
    ) {
      return <FlaskConical className="w-6 h-6 text-violet-500" />;
    }

    return <BrainCircuit className="w-6 h-6 text-violet-500" />;
  };

  return (
    <div className="space-y-8" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "10px" }}>
        {/* DROPDOWN */}
        <div className="relative inline-block mb-5" style={{ position: "relative", display: "inline-block" }}>

          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer"
            style={{ display: "flex", alignItems: "center", gap: "10px", background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
          >
            <h1 className="text-3xl font-black text-[var(--text)] tracking-tight" style={{ fontSize: "32px", fontWeight: 900, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
              {selectedCategory}
            </h1>

            <ChevronDown
              className={`w-6 h-6 text-[var(--text-muted)] transition-transform duration-300 ${openDropdown ? "rotate-180" : ""}`}
              style={{ width: "26px", height: "26px", color: "var(--text-muted)", transition: "transform 0.3s ease", transform: openDropdown ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          {/* MENU */}
          {openDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-2 z-50"
              style={{ position: "absolute", top: "100%", left: 0, marginTop: "12px", width: "200px", borderRadius: "16px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", padding: "8px", zIndex: 50 }}>

              <div className="flex flex-col space-y-1" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {categories.map((cat) => (

                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOpenDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-none cursor-pointer ${selectedCategory === cat
                      ? "bg-teal-50 text-teal-700"
                      : "bg-transparent hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                      }`}
                    style={{ width: "100%", textAlign: "left", padding: "10px 16px", borderRadius: "12px", fontSize: "15px", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s", backgroundColor: selectedCategory === cat ? "#f0fdfa" : "transparent", color: selectedCategory === cat ? "#0f766e" : "#334155" }}
                  >
                    {cat}
                  </button>

                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-3xl animate-pulse bg-[var(--bg-alt)]"
            />
          ))}
        </div>

      ) : filteredSubjects.length ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredSubjects.map((s, i) => (

            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="h-full"
            >

              <Card
                padding="none"
                style={{ padding: "20px" }}
                className="rounded-3xl border border-teal-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
              >

                <div className="flex items-start justify-between mb-5">

                  {/* ICON */}
                  <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0">
                    {getIcon(s.name)}
                  </div>

                  {/* BADGE */}
                  <Badge
                    variant={catBadge[s.category as keyof typeof catBadge] || "default"}
                    size="sm"
                  >
                    {s.category}
                  </Badge>
                </div>

                {/* TITLE */}
                <h3 className="text-[17px] font-bold text-[var(--text)] mb-1 leading-tight line-clamp-2">
                  {s.name}
                </h3>

                {/* CODE */}
                <p className="text-sm text-[var(--text-muted)]">
                  Kode: {s.code}
                </p>

                <div className="flex-1"></div>

                <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">

                  <p className="text-sm text-[var(--text-muted)]">
                    {s._count?.chapters || 0} bab
                  </p>

                  <Link href={`/dashboard/admin/subjects/${s.id}`} className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors bg-transparent border-none" style={{ textDecoration: "none", cursor: "pointer" }}>
                    Kelola Bab →
                  </Link>
                </div>

              </Card>
            </motion.div>

          ))}
        </div>

      ) : (

        <Card
          padding="none"
          style={{ padding: "40px" }}
          className="rounded-3xl text-center py-20"
        >
          <Layers
            size={52}
            className="mx-auto text-[var(--text-muted)] mb-5"
          />

          <p className="text-[var(--text-muted)] text-lg">
            Belum ada mata pelajaran
          </p>
        </Card>

      )}
    </div>
  );
}