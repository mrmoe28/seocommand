'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { signIn } from 'next-auth/react';

interface GoogleConnectCardProps {
  hasGoogleAccess: boolean;
}

export function GoogleConnectCard({ hasGoogleAccess }: GoogleConnectCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Failed to connect Google account:', error);
      setIsConnecting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          {hasGoogleAccess ? (
            <CheckCircle className="h-12 w-12 text-green-600" />
          ) : (
            <AlertCircle className="h-12 w-12 text-yellow-600" />
          )}
        </div>
        <CardTitle>
          {hasGoogleAccess ? 'Google Account Connected' : 'Connect Your Google Account'}
        </CardTitle>
        <CardDescription>
          {hasGoogleAccess
            ? 'Your Google Search Console is connected and ready to sync data.'
            : 'Connect your Google account to access Search Console data and start monitoring your SEO performance.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasGoogleAccess && (
          <>
            <div className="space-y-4">
              <h4 className="font-medium">What you&apos;ll get access to:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Keyword rankings and positions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Click-through rates and impressions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Top performing pages and queries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>SEO performance tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Automated daily data syncing</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Safe & Secure
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-200">
                    We only access your Search Console data with read-only permissions. 
                    Your data remains secure and we never make changes to your Google account.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGoogleConnect} 
              className="w-full" 
              size="lg"
              disabled={isConnecting}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isConnecting ? 'Connecting...' : 'Connect Google Account'}
            </Button>
          </>
        )}

        {hasGoogleAccess && (
          <div className="text-center space-y-4">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
            <p className="text-sm text-muted-foreground">
              You can now add websites and start monitoring your SEO performance.
            </p>
            <Button asChild>
              <a href="/dashboard/websites">
                Add Your First Website
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}