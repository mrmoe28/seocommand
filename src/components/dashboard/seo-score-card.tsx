'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface SEOScoreCardProps {
  score: number;
  recommendations: string[];
}

export function SEOScoreCard({ score, recommendations }: SEOScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getScoreIcon(score)}
          SEO Score
        </CardTitle>
        <CardDescription>
          Overall SEO health based on your keyword performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}/100
            </span>
            <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
              {getScoreLabel(score)}
            </Badge>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Recommendations</h4>
          <ul className="space-y-2 text-sm">
            {recommendations.slice(0, 3).map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{recommendation}</span>
              </li>
            ))}
          </ul>
          {recommendations.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{recommendations.length - 3} more recommendations
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}