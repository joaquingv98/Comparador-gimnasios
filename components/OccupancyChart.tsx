"use client";

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OccupancyDataPoint } from '@/types/gym';

interface OccupancyChartProps {
  data: OccupancyDataPoint[];
  gymName: string;
}

export default function OccupancyChart({ data, gymName }: OccupancyChartProps) {
  const chartData = useMemo(() => {
    // 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
const dayKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()];
const currentDay = dayKey;

    const todaysData = data.filter(d => d.day.toLowerCase() === currentDay);
    
    return todaysData.map(point => ({
      hour: `${point.hour}:00`,
      occupancy: point.occupancy,
      rawHour: point.hour
    }));
  }, [data]);

  const weeklyAverage = useMemo(() => {
    const hourlyAverages: { [hour: number]: number[] } = {};
    
    data.forEach(point => {
      if (!hourlyAverages[point.hour]) {
        hourlyAverages[point.hour] = [];
      }
      hourlyAverages[point.hour].push(point.occupancy);
    });

    return Object.entries(hourlyAverages).map(([hour, occupancies]) => ({
      hour: `${hour}:00`,
      occupancy: Math.round(occupancies.reduce((a, b) => a + b, 0) / occupancies.length),
      rawHour: parseInt(hour)
    })).sort((a, b) => a.rawHour - b.rawHour);
  }, [data]);

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 30) return '#22c55e'; // Green
    if (occupancy < 70) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const occupancy = payload[0].value;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-sm" style={{ color: getOccupancyColor(occupancy) }}>
            Occupancy: {occupancy}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Patrones de Ocupación - {gymName}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Patrón de Hoy</TabsTrigger>
            <TabsTrigger value="weekly">Promedio Semanal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    label={{ value: 'Ocupación %', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="occupancy"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-green-600 font-semibold">Baja</div>
                <div className="text-sm text-green-700">0-30%</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-yellow-600 font-semibold">Moderada</div>
                <div className="text-sm text-yellow-700">30-70%</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-red-600 font-semibold">Alta</div>
                <div className="text-sm text-red-700">70-100%</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAverage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    label={{ value: 'Ocupación %', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="occupancy"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Niveles promedio de ocupación durante todos los días de la semana
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}