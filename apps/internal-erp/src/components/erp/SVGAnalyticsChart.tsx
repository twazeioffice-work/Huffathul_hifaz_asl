"use client";

import { motion } from "framer-motion";

interface ChartPoint {
  label: string;
  value: number;
}

interface SVGChartProps {
  data: ChartPoint[];
  title?: string;
  badge?: string;
  width?: number;
  height?: number;
  lineColor?: string;
}

export default function SVGAnalyticsChart({
  data,
  title = "PERFORMANCE TREND",
  badge = "WEEKLY",
  width = 600,
  height = 300,
  lineColor = "#00F0FF",
}: SVGChartProps) {
  if (!data || data.length < 2) return null;

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxVal = Math.max(...data.map((d) => d.value), 10);

  const points = data.map((d, index) => ({
    x: padding + (index / (data.length - 1)) * chartWidth,
    y: padding + chartHeight - (d.value / maxVal) * chartHeight,
  }));

  const pathData = points.reduce(
    (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  // Area fill path (closed polygon beneath the line)
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`;

  return (
    <div className="glass-panel p-6 rounded-lg w-full flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h3 className="text-sm font-bold tracking-wide text-primary">{title}</h3>
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">
          {badge}
        </span>
      </div>

      <div className="relative w-full aspect-[2/1] min-h-[200px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
            <line
              key={idx}
              x1={padding}
              y1={padding + chartHeight * ratio}
              x2={width - padding}
              y2={padding + chartHeight * ratio}
              stroke="#1E293B"
              strokeDasharray="4 4"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
            <text
              key={`y-${idx}`}
              x={padding - 8}
              y={padding + chartHeight * ratio + 4}
              fill="#64748B"
              fontSize="9"
              textAnchor="end"
            >
              {Math.round(maxVal * (1 - ratio))}
            </text>
          ))}

          {/* Gradient area fill */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Animated trend line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Data point circles and X-axis labels */}
          {points.map((p, idx) => (
            <g key={idx}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill={lineColor}
                stroke="#0A0F1D"
                strokeWidth="2"
                whileHover={{ r: 8 }}
                className="cursor-pointer"
              />
              <text
                x={p.x}
                y={height - 8}
                fill="#94A3B8"
                fontSize="9"
                textAnchor="middle"
              >
                {data[idx].label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
