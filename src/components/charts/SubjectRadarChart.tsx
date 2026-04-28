"use client";

import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Card from "../ui/Card";

interface SubjectRadarChartProps {
  data: { subject: string; score: number; fullMark?: number }[];
  title?: string;
}

export default function SubjectRadarChart({
  data,
  title = "Performa per Mata Pelajaran",
}: SubjectRadarChartProps) {
  return (
    <Card padding="lg" className="animate-fade-in-up">
      <h3 className="text-base font-semibold text-[var(--text)] mb-4">
        {title}
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
              }}
            />
            <Radar
              name="Skor"
              dataKey="score"
              stroke="#219B9E"
              fill="#219B9E"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
