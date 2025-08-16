'use client';

import { useState, useEffect } from 'react';
import { WebsitesTable } from '@/components/dashboard/websites-table';
import { AddWebsiteDialog } from '@/components/dashboard/add-website-dialog';
import { WebsitesAnalyzer } from '@/components/dashboard/websites-analyzer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import type { Site } from '@/lib/db/schema';

export default function WebsitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites', {
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSites(data.sites || []);
      } else {
        console.error('Failed to fetch sites:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Websites</h1>
            <p className="text-muted-foreground">
              Loading your websites...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Websites</h1>
          <p className="text-muted-foreground">
            Manage your websites and track their SEO performance
          </p>
        </div>
        <AddWebsiteDialog onSuccess={fetchSites}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Website
          </Button>
        </AddWebsiteDialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analyzer">SEO Analyzer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <WebsitesTable sites={sites} hasGoogleAccess={true} />
        </TabsContent>
        
        <TabsContent value="analyzer" className="space-y-4">
          <WebsitesAnalyzer sites={sites} />
        </TabsContent>
      </Tabs>
    </div>
  );
}