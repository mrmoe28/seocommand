'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { ExportService } from '@/lib/export';
import { Keyword, Site } from '@/lib/db/schema';
import { toast } from 'sonner';

interface ExportButtonsProps {
  keywords: Keyword[];
  site: Site;
  seoScore?: number;
  recommendations?: string[];
}

export function ExportButtons({ keywords, site, seoScore = 0, recommendations = [] }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleCSVExport = () => {
    try {
      const csvContent = ExportService.generateCSV(keywords, site);
      const filename = `keywords-${site.domain}-${new Date().toISOString().split('T')[0]}.csv`;
      ExportService.downloadCSV(csvContent, filename);
      toast.success('CSV exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  const handlePDFExport = async () => {
    if (keywords.length === 0) {
      toast.error('No keyword data available for export');
      return;
    }

    setIsExporting(true);
    try {
      const stats = {
        totalKeywords: keywords.length,
        averagePosition: keywords.reduce((sum, k) => sum + (k.position || 0), 0) / keywords.length,
        averageCTR: keywords.reduce((sum, k) => sum + (k.ctr || 0), 0) / keywords.length,
        totalClicks: keywords.reduce((sum, k) => sum + (k.clicks || 0), 0),
      };

      await ExportService.generatePDFReport({
        site,
        keywords,
        seoScore,
        recommendations,
        stats,
      });
      
      toast.success('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsExporting(false);
    }
  };

  if (keywords.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCSVExport}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePDFExport} disabled={isExporting}>
          <FileText className="h-4 w-4 mr-2" />
          Generate PDF Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}