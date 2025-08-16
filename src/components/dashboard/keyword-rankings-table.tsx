'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Keyword, Site } from '@/lib/db/schema';
import { ExportButtons } from './export-buttons';

interface KeywordRankingsTableProps {
  keywords: Keyword[];
  site?: Site;
  seoScore?: number;
  recommendations?: string[];
}

export function KeywordRankingsTable({ keywords, site, seoScore, recommendations }: KeywordRankingsTableProps) {
  const getPositionBadge = (position: number | null) => {
    if (!position) return <Badge variant="secondary">-</Badge>;
    
    if (position <= 3) {
      return <Badge className="bg-green-500 hover:bg-green-600">#{position}</Badge>;
    } else if (position <= 10) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">#{position}</Badge>;
    } else {
      return <Badge variant="destructive">#{position}</Badge>;
    }
  };

  const formatCTR = (ctr: number | null) => {
    return ctr ? `${(ctr * 100).toFixed(2)}%` : '0%';
  };

  if (keywords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Keyword Rankings</CardTitle>
          <CardDescription>
            Your top performing keywords and their search positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No keyword data available. Sync your Google Search Console data to see rankings.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Keyword Rankings</CardTitle>
            <CardDescription>
              Your top performing keywords and their search positions
            </CardDescription>
          </div>
          {site && (
            <ExportButtons 
              keywords={keywords} 
              site={site} 
              seoScore={seoScore} 
              recommendations={recommendations} 
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword) => (
              <TableRow key={`${keyword.id}-${keyword.date}`}>
                <TableCell className="font-medium max-w-xs">
                  {keyword.keyword}
                </TableCell>
                <TableCell>
                  {getPositionBadge(keyword.position)}
                </TableCell>
                <TableCell>{keyword.clicks || 0}</TableCell>
                <TableCell>{keyword.impressions || 0}</TableCell>
                <TableCell>{formatCTR(keyword.ctr)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(keyword.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}