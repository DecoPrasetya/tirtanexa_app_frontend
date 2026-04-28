"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Plus, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function TeacherTournamentsPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questionCount, setQuestionCount] = useState(10);
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) { toast.error("Judul wajib diisi"); return; }
    setSaving(true);
    try {
      const t = await api.tournaments.create({ title, description, chapterIds: [], questionCount, timeLimit, maxParticipants });
      toast.success(`Turnamen dibuat! Kode: ${t.code}`);
      router.push(`/dashboard/tournaments/${t.id}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal membuat");
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Buat Turnamen</h1>
      <Card padding="lg" className="space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
          <div className="p-2.5 rounded-xl gradient-teal text-white"><Trophy size={20}/></div>
          <h2 className="text-base font-semibold text-[var(--text)]">Detail Turnamen</h2>
        </div>
        <Input label="Judul Turnamen" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Turnamen Matematika Kelas 12"/>
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Deskripsi</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Deskripsi turnamen..."
            className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"/>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Waktu (menit)</label>
            <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} min={5} max={180}
              className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"/>
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Jumlah Soal</label>
            <input type="number" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} min={5} max={100}
              className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"/>
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Maks Peserta</label>
            <input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} min={2} max={200}
              className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"/>
          </div>
        </div>
        <Button fullWidth size="lg" isLoading={saving} leftIcon={<Save size={18}/>} onClick={handleCreate}>Buat Turnamen</Button>
      </Card>
    </div>
  );
}
