"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import Card from "../ui/Card";

interface ScoreLineChartProps {
  data: { label: string; score: number; date?: string }[];
  title?: string;
}

export default function ScoreLineChart({
  data,
  title = "Perkembangan Skor",
}: ScoreLineChartProps) {
  return (
    <Card padding="lg" className="animate-fade-in-up">
      <h3 className="text-base font-semibold text-[var(--text)] mb-6">
        {title}
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#219B9E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#219B9E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                boxShadow: "var(--shadow-lg)",
              }}
              cursor={{ stroke: "var(--teal)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#219B9E"
              strokeWidth={2.5}
              fill="url(#scoreFill)"
              dot={{ r: 4, fill: "#219B9E", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#219B9E", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
