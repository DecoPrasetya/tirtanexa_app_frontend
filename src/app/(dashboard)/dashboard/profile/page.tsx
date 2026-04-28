"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) { toast.error("Nama tidak boleh kosong"); return; }
    setSaving(true);
    try {
      const updated = await api.auth.updateProfile({ fullName });
      setUser(updated);
      toast.success("Profil berhasil diperbarui");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally { setSaving(false); }
  };

  const roleBadge = { STUDENT: "teal" as const, TEACHER: "orange" as const, ADMIN: "info" as const };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Profil Saya</h1>

      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
        <Card padding="lg" className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-teal flex items-center justify-center text-white text-2xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">{user?.fullName}</h2>
              <Badge variant={roleBadge[user?.role || "STUDENT"]}>{user?.role}</Badge>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-6 space-y-4">
            <Input label="Nama Lengkap" value={fullName} onChange={(e) => setFullName(e.target.value)} leftIcon={<User size={18}/>}/>
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)]">
                <Mail size={18} className="text-[var(--text-muted)]"/>
                <span className="text-sm text-[var(--text-secondary)]">{user?.email}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Email tidak dapat diubah</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Role</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)]">
                  <Shield size={18} className="text-[var(--text-muted)]"/>
                  <span className="text-sm text-[var(--text-secondary)] capitalize">{user?.role?.toLowerCase()}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Bergabung</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)]">
                  <Calendar size={18} className="text-[var(--text-muted)]"/>
                  <span className="text-sm text-[var(--text-secondary)]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID") : "—"}</span>
                </div>
              </div>
            </div>
          </div>

          <Button isLoading={saving} onClick={handleSave} leftIcon={<Save size={16}/>}>Simpan Perubahan</Button>
        </Card>
      </motion.div>
    </div>
  );
}
