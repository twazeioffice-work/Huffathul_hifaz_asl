"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type TimePeriod = "30d" | "60d" | "90d" | "6m" | "1y";

const DUMMY_DATA = {
  "30d": [
    { name: "Day 1", pages: 1.2 },
    { name: "Day 7", pages: 1.5 },
    { name: "Day 15", pages: 1.0 },
    { name: "Day 22", pages: 2.1 },
    { name: "Day 30", pages: 2.5 }
  ],
  "60d": [
    { name: "Wk 1", pages: 0.8 },
    { name: "Wk 3", pages: 1.2 },
    { name: "Wk 5", pages: 1.7 },
    { name: "Wk 7", pages: 2.3 },
    { name: "Wk 8", pages: 2.8 }
  ],
  "90d": [
    { name: "Mo 1", pages: 1.0 },
    { name: "Mo 2", pages: 2.5 },
    { name: "Mo 3", pages: 3.2 }
  ],
  "6m": [
    { name: "M1", pages: -1.0 },
    { name: "M2", pages: 0.5 },
    { name: "M3", pages: 2.0 },
    { name: "M4", pages: 3.5 },
    { name: "M5", pages: 5.0 },
    { name: "M6", pages: 6.2 }
  ],
  "1y": [
    { name: "Q1", pages: 0.5 },
    { name: "Q2", pages: 3.0 },
    { name: "Q3", pages: 6.5 },
    { name: "Q4", pages: 9.0 }
  ]
};

export function MemorizationPaceChart() {
  const [period, setPeriod] = useState<TimePeriod>("30d");

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm w-full">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
          Memorization Pace
        </span>
        
        {/* Period Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          {(["30d", "60d", "90d", "6m", "1y"] as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-md transition-all ${
                period === p
                  ? "bg-white text-cyan-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {p === "30d" ? "30 Days" :
               p === "60d" ? "60 Days" :
               p === "90d" ? "90 Days" :
               p === "6m" ? "6 Months" : "1 Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-40 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DUMMY_DATA[period]} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748B' }} 
              dy={10}
            />
            <YAxis 
              domain={[-2, 10]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748B' }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#475569', fontWeight: 'bold', fontSize: '12px' }}
              itemStyle={{ color: '#0891B2', fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value: any) => [`${value} pgs/day`, 'Pace']}
            />
            <Line
              type="monotone"
              dataKey="pages"
              stroke="#06B6D4" // Cyan-500
              strokeWidth={3}
              dot={{ r: 4, fill: '#06B6D4', strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#0891B2' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer stat */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
         <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
            Student has increased their Hifz progress compared to the previous period!
         </p>
         <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            +12.4%
         </span>
      </div>
    </div>
  );
}
