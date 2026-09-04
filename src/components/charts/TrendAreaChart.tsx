import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendPoint } from '@/types';
import { CHART_COLORS, CHART_INK, axisProps, tooltipStyles } from './chartTheme';

interface TrendAreaChartProps {
  data: TrendPoint[];
  height?: number;
}

/**
 * Registrations and abstract submissions over twelve months.
 * Both series are counts on the same scale, so they share one y-axis —
 * never a second axis.
 */
export function TrendAreaChart({ data, height = 300 }: TrendAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="fillRegistrations" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.22} />
            <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillAbstracts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.2} />
            <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
        <XAxis dataKey="period" {...axisProps} />
        <YAxis {...axisProps} width={46} allowDecimals={false} />
        <Tooltip {...tooltipStyles} />
        <Legend
          verticalAlign="top"
          align="right"
          height={32}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, fontWeight: 600, color: CHART_INK.label }}
        />
        <Area
          type="monotone"
          dataKey="registrations"
          name="Registrations"
          stroke={CHART_COLORS[0]}
          strokeWidth={2}
          fill="url(#fillRegistrations)"
          activeDot={{ r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
        />
        <Area
          type="monotone"
          dataKey="abstracts"
          name="Abstract submissions"
          stroke={CHART_COLORS[1]}
          strokeWidth={2}
          fill="url(#fillAbstracts)"
          activeDot={{ r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
