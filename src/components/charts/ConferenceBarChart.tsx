import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TrendPoint } from '@/types';
import { CHART_INK, CHART_SINGLE_HUE, axisProps, tooltipStyles } from './chartTheme';

interface ConferenceBarChartProps {
  data: TrendPoint[];
  height?: number;
}

/** One measure, so one hue — colour is not carrying identity here. */
export function ConferenceBarChart({ data, height = 260 }: ConferenceBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
        <XAxis dataKey="period" {...axisProps} />
        <YAxis {...axisProps} width={46} allowDecimals={false} />
        <Tooltip {...tooltipStyles} />
        <Bar
          dataKey="conferences"
          name="Conferences starting"
          fill={CHART_SINGLE_HUE}
          radius={[4, 4, 0, 0]}
          maxBarSize={34}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
