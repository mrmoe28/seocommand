'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Keyword } from '@/lib/db/schema';

interface CTRChartProps {
  keywords: Keyword[];
}

export function CTRChart({ keywords }: CTRChartProps) {
  // Group keywords by date and calculate average CTR
  const chartData = keywords.reduce((acc, keyword) => {
    const date = keyword.date;
    if (!acc[date]) {
      acc[date] = { date, ctr: 0, count: 0 };
    }
    acc[date].ctr += keyword.ctr || 0;
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { date: string; ctr: number; count: number }>);

  const formattedData = Object.values(chartData)
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ctr: ((item.ctr / item.count) * 100), // Convert to percentage
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14); // Show last 14 days

  if (formattedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Click-Through Rate Trend</CardTitle>
          <CardDescription>
            Average CTR performance over the last 14 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No CTR data available yet. Sync your Search Console data to see trends.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Click-Through Rate Trend</CardTitle>
        <CardDescription>
          Average CTR performance over the last 14 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Date
                          </span>
                          <span className="font-bold">{label}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Average CTR
                          </span>
                          <span className="font-bold text-blue-600">
                            {payload[0].value?.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="ctr" 
              stroke="#2563eb" 
              strokeWidth={2} 
              dot={{ r: 4, fill: "#2563eb" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}