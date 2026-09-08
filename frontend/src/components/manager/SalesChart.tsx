import React, { useState } from 'react';
import { SalesDataPoint } from '../../types';

interface SalesChartProps {
  data: SalesDataPoint[];
  period: 'Daily' | 'Monthly' | 'Yearly';
  onPeriodChange: (period: 'Daily' | 'Monthly' | 'Yearly') => void;
  title?: string;
  metric?: 'revenue' | 'orders';
}

export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  period,
  onPeriodChange,
  title = 'Sales Overview',
  metric = 'revenue',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const values = data.map((d) => (metric === 'revenue' ? d.revenue : d.ordersCount));
  const maxValue = Math.max(...values, 100);

  // Chart dimensions
  const height = 200;
  const paddingX = 35;
  const paddingY = 25;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
      
      {/* Header with Title and Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-[#5A3E36]">{title}</h3>
          <p className="text-xs text-[#78716C]">
            {period === 'Daily' && 'Hourly store performance for today'}
            {period === 'Monthly' && 'Weekly revenue aggregation this month'}
            {period === 'Yearly' && 'Annual academic calendar sales trajectory'}
          </p>
        </div>

        {/* Daily / Monthly / Yearly Toggles */}
        <div className="flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/15 self-start sm:self-auto">
          {(['Daily', 'Monthly', 'Yearly'] as const).map((p) => {
            const isSelected = period === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPeriodChange(p)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#5A3E36] text-white shadow-2xs'
                    : 'text-[#78716C] hover:text-[#5A3E36]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Bar / Area Visualization */}
      <div className="relative pt-2">
        <svg 
          className="w-full h-52 overflow-visible" 
          viewBox={`0 0 500 ${height}`}
          preserveAspectRatio="none"
        >
          {/* Subtle Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + (height - 2 * paddingY) * (1 - ratio);
            const gridVal = Math.round(maxValue * ratio);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={500 - paddingX}
                  y2={y}
                  stroke="#E7E5E4"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#A8A29E"
                  fontFamily="monospace"
                >
                  {metric === 'revenue' ? `${gridVal}` : `${gridVal}`}
                </text>
              </g>
            );
          })}

          {/* Bar Columns */}
          {data.map((point, index) => {
            const totalBars = data.length;
            const availableWidth = 500 - 2 * paddingX;
            const slotWidth = availableWidth / totalBars;
            const barWidth = Math.min(Math.max(slotWidth * 0.55, 14), 32);
            const centerX = paddingX + index * slotWidth + slotWidth / 2;
            const barX = centerX - barWidth / 2;

            const val = metric === 'revenue' ? point.revenue : point.ordersCount;
            const barHeight = ((height - 2 * paddingY) * val) / maxValue;
            const barY = height - paddingY - barHeight;

            const isHovered = hoveredIdx === index;

            return (
              <g 
                key={index}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Background hover bar track */}
                <rect
                  x={centerX - slotWidth / 2 + 2}
                  y={paddingY}
                  width={slotWidth - 4}
                  height={height - 2 * paddingY}
                  fill={isHovered ? '#F58FA3' : 'transparent'}
                  fillOpacity="0.08"
                  rx="4"
                />

                {/* Main Value Bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={isHovered ? '#E85D75' : '#5A3E36'}
                  rx="6"
                  className="transition-all duration-150"
                />

                {/* Top cap highlight */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={Math.min(barHeight, 4)}
                  fill="#F58FA3"
                  rx="2"
                />

                {/* X-axis Label */}
                <text
                  x={centerX}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  fill={isHovered ? '#5A3E36' : '#78716C'}
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Tooltip Pill */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5A3E36] text-white px-3 py-1.5 rounded-xl text-xs shadow-lg pointer-events-none flex items-center gap-2 font-mono animate-in fade-in duration-100"
          >
            <span className="font-bold text-[#F58FA3]">{data[hoveredIdx].label}:</span>
            <span>{data[hoveredIdx].revenue.toLocaleString()} ETB</span>
            <span className="text-stone-300">({data[hoveredIdx].ordersCount} orders)</span>
          </div>
        )}
      </div>

    </div>
  );
};
