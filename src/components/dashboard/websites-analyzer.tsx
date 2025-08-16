'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Search, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  Globe,
  FileText,
  Clock,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { Site } from '@/lib/db/schema';

interface WebsitesAnalyzerProps {
  sites: Site[];
}

interface SEOAnalysis {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'success';
    category: string;
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
  }>;
  metrics: {
    pageSpeed: number;
    mobileUsability: number;
    seoScore: number;
    accessibility: number;
    performance: number;
    security: number;
  };
  recommendations: string[];
  isRealData?: boolean;
  lastAnalyzed?: string;
}

const mockAnalysisData: Record<number, SEOAnalysis> = {
  1: {
    score: 72,
    issues: [
      {
        type: 'error',
        category: 'Performance',
        title: 'Large Cumulative Layout Shift',
        description: 'Your page layout shifts significantly during load, affecting user experience.',
        impact: 'High'
      },
      {
        type: 'warning',
        category: 'SEO',
        title: 'Missing Meta Description',
        description: 'Some pages are missing meta descriptions which help with search rankings.',
        impact: 'Medium'
      },
      {
        type: 'warning',
        category: 'Images',
        title: 'Images Without Alt Text',
        description: '12 images are missing alt text, affecting accessibility and SEO.',
        impact: 'Medium'
      },
      {
        type: 'success',
        category: 'Security',
        title: 'HTTPS Configured',
        description: 'Your site properly uses HTTPS encryption.',
        impact: 'High'
      },
      {
        type: 'success',
        category: 'Mobile',
        title: 'Mobile Responsive',
        description: 'Your site is properly optimized for mobile devices.',
        impact: 'High'
      }
    ],
    metrics: {
      pageSpeed: 68,
      mobileUsability: 89,
      seoScore: 72,
      accessibility: 76,
      performance: 64,
      security: 95
    },
    recommendations: [
      'Optimize images by compressing and using modern formats (WebP, AVIF)',
      'Minimize JavaScript and CSS to reduce bundle size',
      'Add meta descriptions to all pages for better search visibility',
      'Implement lazy loading for images below the fold',
      'Fix layout shift issues by setting dimensions for dynamic content'
    ]
  },
  2: {
    score: 85,
    issues: [
      {
        type: 'warning',
        category: 'Performance',
        title: 'Unused CSS',
        description: 'Some CSS files contain unused styles that slow down loading.',
        impact: 'Low'
      },
      {
        type: 'success',
        category: 'SEO',
        title: 'Structured Data Present',
        description: 'Your site uses proper structured data markup.',
        impact: 'Medium'
      },
      {
        type: 'success',
        category: 'Security',
        title: 'Security Headers Configured',
        description: 'Proper security headers are in place.',
        impact: 'High'
      }
    ],
    metrics: {
      pageSpeed: 82,
      mobileUsability: 94,
      seoScore: 85,
      accessibility: 88,
      performance: 79,
      security: 98
    },
    recommendations: [
      'Remove unused CSS to improve loading speed',
      'Consider implementing a content delivery network (CDN)',
      'Add more internal linking to improve page authority distribution'
    ]
  },
  3: {
    score: 91,
    issues: [
      {
        type: 'success',
        category: 'Performance',
        title: 'Excellent Core Web Vitals',
        description: 'Your site meets all Core Web Vitals thresholds.',
        impact: 'High'
      },
      {
        type: 'success',
        category: 'SEO',
        title: 'Complete Meta Data',
        description: 'All pages have proper title tags and meta descriptions.',
        impact: 'High'
      },
      {
        type: 'success',
        category: 'Accessibility',
        title: 'WCAG Compliant',
        description: 'Your site meets WCAG 2.1 accessibility guidelines.',
        impact: 'High'
      }
    ],
    metrics: {
      pageSpeed: 94,
      mobileUsability: 96,
      seoScore: 91,
      accessibility: 92,
      performance: 89,
      security: 97
    },
    recommendations: [
      'Consider implementing advanced SEO features like FAQ schema',
      'Monitor and maintain current performance levels',
      'Continue regular content updates for SEO freshness'
    ]
  }
};

export function WebsitesAnalyzer({ sites }: WebsitesAnalyzerProps) {
  const [selectedSite, setSelectedSite] = useState<number>(sites[0]?.id || 1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [realAnalysis, setRealAnalysis] = useState<SEOAnalysis | null>(null);

  const analysis = realAnalysis || mockAnalysisData[selectedSite];

  // If no sites, show empty state
  if (sites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Website Analyzer
          </CardTitle>
          <CardDescription>
            Add websites to start analyzing their SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No websites available for analysis. Add your first website to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    const selectedSiteData = sites.find(site => site.id === selectedSite);
    if (!selectedSiteData) {
      setIsAnalyzing(false);
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading(`Analyzing ${selectedSiteData.domain}...`);
    
    try {
      // Use our web scraping SEO analysis API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: selectedSiteData.url }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const analysisResult = data.analysis;
        
        // Convert our analysis result to the component format
        const realAnalysisData: SEOAnalysis = {
          score: analysisResult.score,
          metrics: analysisResult.metrics,
          issues: analysisResult.issues,
          recommendations: analysisResult.recommendations,
          isRealData: true,
          lastAnalyzed: analysisResult.analyzedAt
        };
        
        setRealAnalysis(realAnalysisData);
        
        // Show success toast
        toast.success(`Analysis complete! SEO score: ${analysisResult.score}/100`, {
          id: loadingToast,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Show user-friendly error toast
      if (errorMessage.includes('404')) {
        toast.error('Website not found. Please check if the URL is correct and accessible.', {
          id: loadingToast,
          description: 'Try testing with a well-known URL like google.com or github.com',
        });
      } else if (errorMessage.includes('403')) {
        toast.error('Access blocked by website security.', {
          id: loadingToast,
          description: 'The website is blocking our analysis request.',
        });
      } else if (errorMessage.includes('Network')) {
        toast.error('Network connection failed.', {
          id: loadingToast,
          description: 'Please check your internet connection and try again.',
        });
      } else {
        toast.error('Analysis failed', {
          id: loadingToast,
          description: errorMessage,
        });
      }
    }
    
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Website Analyzer
          </CardTitle>
          <CardDescription>
            Get comprehensive SEO analysis and recommendations for your websites
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedSite.toString()} onValueChange={(value) => setSelectedSite(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a website to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {site.domain}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <>
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Overall SEO Score
                {analysis.isRealData && (
                  <Badge variant="secondary" className="text-xs">
                    Live Data
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {analysis.isRealData 
                  ? `Real-time analysis completed ${new Date(analysis.lastAnalyzed!).toLocaleTimeString()}`
                  : 'Comprehensive analysis of your website\'s SEO health'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="flex-1 ml-8">
                  <Progress 
                    value={analysis.score} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Poor</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Key performance indicators for your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Page Speed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.metrics.pageSpeed} className="flex-1 h-2" />
                    <span className={`text-sm font-bold ${getScoreColor(analysis.metrics.pageSpeed)}`}>
                      {analysis.metrics.pageSpeed}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Mobile Usability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.metrics.mobileUsability} className="flex-1 h-2" />
                    <span className={`text-sm font-bold ${getScoreColor(analysis.metrics.mobileUsability)}`}>
                      {analysis.metrics.mobileUsability}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">SEO Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.metrics.seoScore} className="flex-1 h-2" />
                    <span className={`text-sm font-bold ${getScoreColor(analysis.metrics.seoScore)}`}>
                      {analysis.metrics.seoScore}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Accessibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.metrics.accessibility} className="flex-1 h-2" />
                    <span className={`text-sm font-bold ${getScoreColor(analysis.metrics.accessibility)}`}>
                      {analysis.metrics.accessibility}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Performance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.metrics.performance} className="flex-1 h-2" />
                    <span className={`text-sm font-bold ${getScoreColor(analysis.metrics.performance)}`}>
                      {analysis.metrics.performance}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.metrics.security} className="flex-1 h-2" />
                    <span className={`text-sm font-bold ${getScoreColor(analysis.metrics.security)}`}>
                      {analysis.metrics.security}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues & Recommendations */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Issues Found
                </CardTitle>
                <CardDescription>
                  Areas that need attention to improve your SEO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="mt-1">
                        {issue.type === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        {issue.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                        {issue.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium">{issue.title}</h4>
                          <Badge 
                            variant={issue.impact === 'High' ? 'destructive' : issue.impact === 'Medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {issue.impact}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{issue.category}</p>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable steps to improve your SEO performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm flex-1">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}