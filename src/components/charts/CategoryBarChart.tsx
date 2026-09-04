import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_INK, CHART_SINGLE_HUE, axisProps, tooltipStyles } from './chartTheme';

interface CategoryBarChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

/**
 * Horizontal bars rather than a donut: seven categories are too many slices to
 * compare by angle, and a bar chart makes the ranking readable at a glance.
 */
export function CategoryBarChart({ data, height = 300 }: CategoryBarChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 4, right: 28, left: 8, bottom: 0 }}
        barCategoryGap="26%"
      >
        <CartesianGrid horizontal={false} stroke={CHART_INK.grid} />
        <XAxis type="number" {...axisProps} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          {...axisProps}
          width={132}
          tick={{ fontSize: 11, fill: CHART_INK.label, fontWeight: 600 }}
        />
        <Tooltip {...tooltipStyles} />
        <Bar dataKey="value" name="Conferences" fill={CHART_SINGLE_HUE} radius={[0, 4, 4, 0]} maxBarSize={20}>
          <LabelList
            dataKey="value"
            position="right"
            style={{ fontSize: 11, fontWeight: 700, fill: CHART_INK.strong }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
