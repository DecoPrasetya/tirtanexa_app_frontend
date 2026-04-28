"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import type { Subject, Chapter } from "@/lib/types";
import toast from "react-hot-toast";

interface OptionInput { label: string; content: string; isCorrect: boolean; }

export default function CreateQuestionPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [content, setContent] = useState("");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [options, setOptions] = useState<OptionInput[]>([
    { label: "A", content: "", isCorrect: true },
    { label: "B", content: "", isCorrect: false },
    { label: "C", content: "", isCorrect: false },
    { label: "D", content: "", isCorrect: false },
    { label: "E", content: "", isCorrect: false },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.subjects.getAll().then((d) => setSubjects(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!subjectId) { setChapters([]); return; }
    api.subjects.getChapters(subjectId).then((d) => setChapters(Array.isArray(d) ? d : [])).catch(() => {});
  }, [subjectId]);

  const setOptionContent = (i: number, val: string) => setOptions((p) => p.map((o, idx) => idx === i ? { ...o, content: val } : o));
  const setCorrect = (i: number) => setOptions((p) => p.map((o, idx) => ({ ...o, isCorrect: idx === i })));

  const handleSubmit = async () => {
    if (!chapterId || !content.trim()) { toast.error("Isi bab dan konten soal"); return; }
    if (!options.some((o) => o.content.trim())) { toast.error("Isi minimal 1 opsi jawaban"); return; }
    setSaving(true);
    try {
      await api.questions.create({
        chapterId, content, explanation: explanation || undefined,
        difficulty: difficulty as "EASY"|"MEDIUM"|"HARD",
        options: options.filter((o) => o.content.trim()).map((o, i) => ({ ...o, order: i })),
      });
      toast.success("Soal berhasil dibuat!");
      router.push("/dashboard/teacher/questions");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] cursor-pointer"><ArrowLeft size={20}/></button>
        <h1 className="text-2xl font-bold text-[var(--text)]">Buat Soal Baru</h1>
      </div>

      <Card padding="lg" className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Mata Pelajaran</label>
            <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setChapterId(""); }}
              className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)] cursor-pointer">
              <option value="">Pilih</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Bab</label>
            <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} disabled={!subjectId}
              className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)] disabled:opacity-50 cursor-pointer">
              <option value="">Pilih</option>
              {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Tingkat Kesulitan</label>
          <div className="flex gap-2">
            {[{v:"EASY",l:"Mudah"},{v:"MEDIUM",l:"Sedang"},{v:"HARD",l:"Sulit"}].map((d) => (
              <button key={d.v} onClick={() => setDifficulty(d.v)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${difficulty === d.v ? "bg-[var(--teal)] text-white" : "bg-[var(--bg)] text-[var(--text-secondary)]"}`}>{d.l}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Konten Soal</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="Tulis soal di sini..."
            className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"/>
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Opsi Jawaban</label>
          <div className="space-y-3">
            {options.map((opt, i) => (
              <div key={opt.label} className="flex items-center gap-3">
                <button onClick={() => setCorrect(i)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold flex-shrink-0 transition-all cursor-pointer ${opt.isCorrect ? "gradient-teal text-white" : "bg-[var(--bg)] text-[var(--text-muted)] hover:bg-[var(--bg-alt)]"}`}>{opt.label}</button>
                <input type="text" value={opt.content} onChange={(e) => setOptionContent(i, e.target.value)} placeholder={`Jawaban ${opt.label}`}
                  className="flex-1 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"/>
              </div>
            ))}
            <p className="text-xs text-[var(--text-muted)]">Klik huruf untuk menandai jawaban benar</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Pembahasan (opsional)</label>
          <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={3} placeholder="Tulis pembahasan..."
            className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"/>
        </div>

        <Button fullWidth size="lg" isLoading={saving} leftIcon={<Save size={18}/>} onClick={handleSubmit}>Simpan Soal</Button>
      </Card>
    </div>
  );
}
