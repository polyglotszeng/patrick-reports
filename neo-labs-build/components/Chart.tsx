'use client';

import { Bar, Radar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, RadialLinearScale,
  PointElement, LineElement, ArcElement, Tooltip, Legend, Filler, Title
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler, Title);

interface Props {
  type: 'val' | 'radar' | 'doughnut' | 'line';
  data: any;
  options?: any;
}

export function Chart({ type, data, options }: Props) {
  if (type === 'val') return <Bar data={data} options={options} />;
  if (type === 'radar') return <Radar data={data} options={options} />;
  if (type === 'doughnut') return <Doughnut data={data} options={options} />;
  return <Line data={data} options={options} />;
}
