'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import { Site } from '@/lib/db/schema';
import { toast } from 'sonner';
import { GoogleConnectCard } from './google-connect-card';

interface WebsitesTableProps {
  sites: Site[];
  hasGoogleAccess: boolean;
}

export function WebsitesTable({ sites, hasGoogleAccess }: WebsitesTableProps) {
  const [isLoading, setIsLoading] = useState<number | null>(null);

  const handleSync = async (siteId: number) => {
    setIsLoading(siteId);
    try {
      const response = await fetch('/api/google/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siteId }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Synced ${data.keywordCount} keywords. SEO Score: ${data.seoScore}/100`);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error('Failed to sync website data');
      }
    } catch (error) {
      console.error('Error syncing:', error);
      toast.error('Failed to sync website data');
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async (siteId: number) => {
    if (!confirm('Are you sure you want to delete this website? This will also delete all associated keyword data.')) {
      return;
    }

    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Website deleted successfully');
        window.location.reload();
      } else {
        toast.error('Failed to delete website');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete website');
    }
  };

  if (!hasGoogleAccess) {
    return <GoogleConnectCard hasGoogleAccess={false} />;
  }

  if (sites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Websites Added</CardTitle>
          <CardDescription>
            Add your first website to start monitoring its SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Connect your Google Search Console and add websites to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Websites</CardTitle>
        <CardDescription>
          Monitor and manage your websites&apos; SEO performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Website</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{site.url}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={site.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{site.domain}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(site.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">Active</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleSync(site.id)}
                        disabled={isLoading === site.id}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading === site.id ? 'animate-spin' : ''}`} />
                        {isLoading === site.id ? 'Syncing...' : 'Sync Data'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(site.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}