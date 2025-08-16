'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Search, TrendingUp, MousePointer } from 'lucide-react';

interface StatsCardsProps {
  totalSites: number;
  totalKeywords: number;
  averagePosition: number;
  averageCTR: number;
}

export function StatsCards({ totalSites, totalKeywords, averagePosition, averageCTR }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Websites',
      value: totalSites.toString(),
      icon: Globe,
      description: 'Connected websites',
    },
    {
      title: 'Tracked Keywords',
      value: totalKeywords.toString(),
      icon: Search,
      description: 'Keywords being monitored',
    },
    {
      title: 'Average Position',
      value: averagePosition > 0 ? averagePosition.toFixed(1) : '0',
      icon: TrendingUp,
      description: 'Average search ranking',
    },
    {
      title: 'Average CTR',
      value: averageCTR > 0 ? `${(averageCTR * 100).toFixed(2)}%` : '0%',
      icon: MousePointer,
      description: 'Click-through rate',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}