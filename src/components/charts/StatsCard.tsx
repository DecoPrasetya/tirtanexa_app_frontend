"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  gradient: "teal" | "orange" | "teal-dark";
  delay?: number;
}

const gradientMap = {
  teal: "from-[var(--teal)] to-[var(--teal-light)]",
  "teal-dark": "from-[var(--teal-dark)] to-[var(--teal)]",
  orange: "from-[var(--orange)] to-[var(--orange-light)]",
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  gradient,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`
        relative overflow-hidden rounded-[var(--radius-xl)] p-6
        bg-gradient-to-br ${gradientMap[gradient]}
        text-white shadow-lg
      `}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-white/70 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? "bg-white/20 text-white"
                    : "bg-red-400/30 text-red-100"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-white/60">dari bulan lalu</span>
            </div>
          )}
        </div>

        <div className="p-3 rounded-[var(--radius-lg)] bg-white/15 backdrop-blur-sm">
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}
