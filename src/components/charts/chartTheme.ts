/**
 * Categorical palette for admin charts.
 *
 * Validated for the light chart surface: lightness band, chroma floor,
 * adjacent-pair CVD separation (worst 16.8 ΔE protan), normal-vision floor
 * (worst 19.9 ΔE) and >= 3:1 contrast against the surface all pass.
 * Hues are assigned in fixed order and never cycled — a series keeps its colour
 * even when a filter removes its neighbours.
 */
export const CHART_COLORS = ['#2563EB', '#0E9AA7', '#D97706'] as const;

/** Single-hue fill for one-measure comparisons (no identity to encode). */
export const CHART_SINGLE_HUE = '#2563EB';

export const CHART_INK = {
  axis: '#7B8494',
  grid: '#EFF1F5',
  label: '#5A6474',
  strong: '#16181D',
} as const;

export const axisProps = {
  stroke: CHART_INK.axis,
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 11, fill: CHART_INK.label, fontWeight: 600 },
} as const;

export const tooltipStyles = {
  contentStyle: {
    borderRadius: 8,
    border: '1px solid #E4E7EC',
    boxShadow: '0 8px 24px rgba(11,31,58,0.10)',
    fontSize: 12,
    padding: '10px 12px',
  },
  labelStyle: { fontWeight: 700, color: CHART_INK.strong, marginBottom: 4 },
  itemStyle: { padding: 0, color: CHART_INK.label },
  cursor: { fill: 'rgba(37,99,235,0.06)' },
} as const;
