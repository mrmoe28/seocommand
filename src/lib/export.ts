import { Keyword, Site } from '@/lib/db/schema';

export class ExportService {
  static generateCSV(keywords: Keyword[], site: Site): string {
    const headers = ['Keyword', 'Position', 'Clicks', 'Impressions', 'CTR', 'Date'];
    
    const csvContent = [
      headers.join(','),
      ...keywords.map(keyword => [
        `"${keyword.keyword}"`,
        keyword.position || 0,
        keyword.clicks || 0,
        keyword.impressions || 0,
        keyword.ctr || 0,
        keyword.date
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  static downloadCSV(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static async generatePDFReport(data: {
    site: Site;
    keywords: Keyword[];
    seoScore: number;
    recommendations: string[];
    stats: {
      totalKeywords: number;
      averagePosition: number;
      averageCTR: number;
      totalClicks: number;
    };
  }): Promise<void> {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import('jspdf')).default;
    const html2canvas = (await import('html2canvas')).default;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SEO Performance Report', 20, 30);
    
    // Site info
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Website: ${data.site.domain}`, 20, 50);
    pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 65);
    
    // SEO Score
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SEO Score', 20, 90);
    
    pdf.setFontSize(24);
    const scoreColor = data.seoScore >= 80 ? [34, 197, 94] : data.seoScore >= 60 ? [234, 179, 8] : [239, 68, 68];
    pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.text(`${data.seoScore}/100`, 20, 110);
    
    // Reset color
    pdf.setTextColor(0, 0, 0);
    
    // Stats
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Metrics', 20, 140);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    const statsY = 155;
    pdf.text(`Total Keywords: ${data.stats.totalKeywords}`, 20, statsY);
    pdf.text(`Average Position: ${data.stats.averagePosition.toFixed(1)}`, 20, statsY + 15);
    pdf.text(`Average CTR: ${(data.stats.averageCTR * 100).toFixed(2)}%`, 20, statsY + 30);
    pdf.text(`Total Clicks: ${data.stats.totalClicks}`, 20, statsY + 45);
    
    // Recommendations
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommendations', 20, 230);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    let recY = 245;
    data.recommendations.slice(0, 5).forEach((rec, index) => {
      const lines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 40);
      pdf.text(lines, 20, recY);
      recY += lines.length * 5 + 5;
    });
    
    // Top Keywords (new page)
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Top Keywords', 20, 30);
    
    // Table headers
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const headers = ['Keyword', 'Position', 'Clicks', 'Impressions', 'CTR'];
    const colWidths = [60, 25, 25, 30, 25];
    let x = 20;
    
    headers.forEach((header, index) => {
      pdf.text(header, x, 50);
      x += colWidths[index];
    });
    
    // Table data
    pdf.setFont('helvetica', 'normal');
    let y = 65;
    const topKeywords = data.keywords
      .sort((a, b) => (a.position || 100) - (b.position || 100))
      .slice(0, 20);
    
    topKeywords.forEach((keyword) => {
      if (y > pageHeight - 30) {
        pdf.addPage();
        y = 30;
      }
      
      x = 20;
      const rowData = [
        keyword.keyword.length > 25 ? keyword.keyword.substring(0, 25) + '...' : keyword.keyword,
        (keyword.position || 0).toString(),
        (keyword.clicks || 0).toString(),
        (keyword.impressions || 0).toString(),
        ((keyword.ctr || 0) * 100).toFixed(1) + '%'
      ];
      
      rowData.forEach((data, index) => {
        pdf.text(data, x, y);
        x += colWidths[index];
      });
      
      y += 12;
    });
    
    // Save PDF
    const filename = `seo-report-${data.site.domain}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  }
}