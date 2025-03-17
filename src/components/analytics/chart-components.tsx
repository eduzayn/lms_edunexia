'use client'

import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface ChartProps {
  data: ChartData[]
  title: string
  type?: 'line' | 'bar'
  color?: string
  height?: number | string
  dataKeys?: string[]
}

export function Chart({
  data,
  title,
  type = 'line',
  color = '#2563eb',
  height = 300,
  dataKeys = ['value'],
}: ChartProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={Array.isArray(color) ? color[index] : color}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={Array.isArray(color) ? color[index] : color}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 