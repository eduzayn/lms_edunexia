"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

// Registrando os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Opções padrão para gráficos de linha
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Opções padrão para gráficos de rosca
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
  }[];
}

interface ChartProps {
  data: ChartData;
  height?: number;
}

export function LineChart({ data, height = 300 }: ChartProps) {
  return (
    <div style={{ height }}>
      <Line options={lineOptions} data={data} />
    </div>
  );
}

export function DoughnutChart({ data, height = 300 }: ChartProps) {
  return (
    <div style={{ height }}>
      <Doughnut options={doughnutOptions} data={data} />
    </div>
  );
}

export function BarChart(_props: ChartProps) { // eslint-disable-line @typescript-eslint/no-unused-vars
  // This is a placeholder component
  // In a real implementation, this would use a chart library
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <p className="text-muted-foreground">Gráfico de Barras</p>
        <p className="text-xs text-muted-foreground mt-1">
          (Implementação real usaria Chart.js ou similar)
        </p>
      </div>
    </div>
  );
}

export function PieChart(_props: ChartProps) { // eslint-disable-line @typescript-eslint/no-unused-vars
  // This is a placeholder component
  // In a real implementation, this would use a chart library
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <p className="text-muted-foreground">Gráfico de Pizza</p>
        <p className="text-xs text-muted-foreground mt-1">
          (Implementação real usaria Chart.js ou similar)
        </p>
      </div>
    </div>
  );
}

export function RadarChart(_props: ChartProps) { // eslint-disable-line @typescript-eslint/no-unused-vars
  // This is a placeholder component
  // In a real implementation, this would use a chart library
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <p className="text-muted-foreground">Gráfico de Radar</p>
        <p className="text-xs text-muted-foreground mt-1">
          (Implementação real usaria Chart.js ou similar)
        </p>
      </div>
    </div>
  );
}
