// Using regex-based HTML parsing instead of JSDOM for simplicity

export interface SEOAnalysisResult {
  url: string;
  score: number;
  metrics: {
    pageSpeed: number;
    mobileUsability: number;
    seoScore: number;
    accessibility: number;
    performance: number;
    security: number;
  };
  seoElements: {
    title: string | null;
    titleLength: number;
    metaDescription: string | null;
    metaDescriptionLength: number;
    h1Tags: string[];
    h2Tags: string[];
    imageCount: number;
    imagesWithoutAlt: number;
    internalLinks: number;
    externalLinks: number;
  };
  issues: Array<{
    type: 'error' | 'warning' | 'success';
    category: string;
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
  }>;
  recommendations: string[];
  analyzedAt: string;
}

export class SEOAnalyzer {
  async analyzeWebsite(url: string): Promise<SEOAnalysisResult> {
    try {
      // Fix and validate URL
      let cleanUrl = url.trim();
      
      // Add https:// if no protocol is specified
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      
      const validUrl = new URL(cleanUrl);
      
      // Fetch the webpage with better headers
      const response = await fetch(validUrl.href, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-SiteWatcher/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        redirect: 'follow',
      });

      if (!response.ok) {
        // Provide more helpful error messages
        if (response.status === 404) {
          throw new Error(`Website not found (404). Please check if the URL "${validUrl.href}" is correct and accessible.`);
        } else if (response.status === 403) {
          throw new Error(`Access forbidden (403). The website "${validUrl.href}" is blocking our request.`);
        } else if (response.status >= 500) {
          throw new Error(`Server error (${response.status}). The website "${validUrl.href}" is experiencing technical issues.`);
        } else {
          throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
        }
      }

      const html = await response.text();

      // Analyze SEO elements using regex parsing
      const seoElements = this.analyzeSEOElements(html);
      
      // Calculate scores
      const metrics = this.calculateMetrics(seoElements, html);
      
      // Generate issues and recommendations
      const { issues, recommendations } = this.generateIssuesAndRecommendations(seoElements, metrics);
      
      // Calculate overall score
      const score = this.calculateOverallScore(metrics);

      return {
        url: validUrl.href,
        score,
        metrics,
        seoElements,
        issues,
        recommendations,
        analyzedAt: new Date().toISOString(),
      };

    } catch (error) {
      console.error('SEO Analysis Error:', error);
      
      // Provide helpful suggestions for common errors
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        errorMessage += '\n\nTry testing with a well-known URL like:\n• https://google.com\n• https://github.com\n• https://example.com';
      }
      
      throw new Error(`Failed to analyze website: ${errorMessage}`);
    }
  }

  private analyzeSEOElements(html: string) {
    // Title analysis using regex
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    const titleLength = title?.length || 0;

    // Meta description analysis using regex
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;
    const metaDescriptionLength = metaDescription?.length || 0;

    // Header tags analysis using regex
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    const h1Tags = h1Matches.map(match => {
      const content = match.replace(/<[^>]*>/g, '').trim();
      return content;
    });

    const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
    const h2Tags = h2Matches.map(match => {
      const content = match.replace(/<[^>]*>/g, '').trim();
      return content;
    });

    // Image analysis using regex
    const imageMatches = html.match(/<img[^>]*>/gi) || [];
    const imageCount = imageMatches.length;
    const imagesWithoutAlt = imageMatches.filter(img => !img.includes('alt=')).length;

    // Link analysis using regex
    const linkMatches = html.match(/<a[^>]*href=["'](.*?)["'][^>]*>/gi) || [];
    let internalLinks = 0;
    let externalLinks = 0;

    linkMatches.forEach(link => {
      const hrefMatch = link.match(/href=["'](.*?)["']/i);
      if (hrefMatch) {
        const href = hrefMatch[1];
        if (href.startsWith('http')) {
          externalLinks++;
        } else if (href.startsWith('/') || href.startsWith('#')) {
          internalLinks++;
        }
      }
    });

    return {
      title,
      titleLength,
      metaDescription,
      metaDescriptionLength,
      h1Tags,
      h2Tags,
      imageCount,
      imagesWithoutAlt,
      internalLinks,
      externalLinks,
    };
  }

  private calculateMetrics(seoElements: SEOAnalysisResult['seoElements'], html: string) {
    // Basic performance estimation based on content size
    const htmlSize = html.length;
    const pageSpeed = Math.max(0, Math.min(100, 100 - (htmlSize / 1000))); // Rough estimation

    // SEO score based on elements
    let seoScore = 100;
    
    if (!seoElements.title) seoScore -= 15;
    else if (seoElements.titleLength < 30 || seoElements.titleLength > 60) seoScore -= 10;
    
    if (!seoElements.metaDescription) seoScore -= 15;
    else if (seoElements.metaDescriptionLength < 120 || seoElements.metaDescriptionLength > 160) seoScore -= 10;
    
    if (seoElements.h1Tags.length === 0) seoScore -= 10;
    if (seoElements.h1Tags.length > 1) seoScore -= 5;
    
    if (seoElements.imagesWithoutAlt > 0) {
      seoScore -= Math.min(15, seoElements.imagesWithoutAlt * 2);
    }

    // Accessibility estimation
    const accessibility = seoElements.imagesWithoutAlt === 0 ? 95 : Math.max(60, 95 - (seoElements.imagesWithoutAlt * 5));

    // Basic security check (HTTPS)
    const security = html.includes('https://') ? 95 : 70;

    // Mobile usability estimation
    const hasViewport = html.includes('viewport');
    const mobileUsability = hasViewport ? 90 : 60;

    return {
      pageSpeed: Math.round(pageSpeed),
      mobileUsability: Math.round(mobileUsability),
      seoScore: Math.round(Math.max(0, seoScore)),
      accessibility: Math.round(accessibility),
      performance: Math.round(pageSpeed),
      security: Math.round(security),
    };
  }

  private generateIssuesAndRecommendations(seoElements: SEOAnalysisResult['seoElements'], metrics: SEOAnalysisResult['metrics']) {
    const issues: SEOAnalysisResult['issues'] = [];
    const recommendations: string[] = [];

    // Title issues
    if (!seoElements.title) {
      issues.push({
        type: 'error',
        category: 'SEO',
        title: 'Missing Page Title',
        description: 'This page does not have a title tag, which is crucial for SEO.',
        impact: 'High'
      });
      recommendations.push('Add a descriptive title tag to your page');
    } else if (seoElements.titleLength < 30) {
      issues.push({
        type: 'warning',
        category: 'SEO',
        title: 'Title Too Short',
        description: 'Page title is shorter than recommended (30-60 characters).',
        impact: 'Medium'
      });
      recommendations.push('Expand your title tag to be more descriptive (30-60 characters)');
    } else if (seoElements.titleLength > 60) {
      issues.push({
        type: 'warning',
        category: 'SEO',
        title: 'Title Too Long',
        description: 'Page title may be truncated in search results (over 60 characters).',
        impact: 'Medium'
      });
      recommendations.push('Shorten your title tag to under 60 characters');
    }

    // Meta description issues
    if (!seoElements.metaDescription) {
      issues.push({
        type: 'error',
        category: 'SEO',
        title: 'Missing Meta Description',
        description: 'This page does not have a meta description.',
        impact: 'High'
      });
      recommendations.push('Add a compelling meta description (120-160 characters)');
    } else if (seoElements.metaDescriptionLength < 120) {
      issues.push({
        type: 'warning',
        category: 'SEO',
        title: 'Meta Description Too Short',
        description: 'Meta description is shorter than recommended.',
        impact: 'Medium'
      });
      recommendations.push('Expand your meta description to 120-160 characters');
    }

    // Header issues
    if (seoElements.h1Tags.length === 0) {
      issues.push({
        type: 'error',
        category: 'SEO',
        title: 'Missing H1 Tag',
        description: 'This page does not have an H1 heading tag.',
        impact: 'High'
      });
      recommendations.push('Add a clear H1 heading to your page');
    } else if (seoElements.h1Tags.length > 1) {
      issues.push({
        type: 'warning',
        category: 'SEO',
        title: 'Multiple H1 Tags',
        description: 'Page has multiple H1 tags. Best practice is to have only one.',
        impact: 'Medium'
      });
      recommendations.push('Use only one H1 tag per page');
    }

    // Image issues
    if (seoElements.imagesWithoutAlt > 0) {
      issues.push({
        type: 'warning',
        category: 'Accessibility',
        title: 'Images Missing Alt Text',
        description: `${seoElements.imagesWithoutAlt} images are missing alt attributes.`,
        impact: 'Medium'
      });
      recommendations.push('Add descriptive alt text to all images');
    }

    // Performance issues
    if (metrics.pageSpeed < 70) {
      issues.push({
        type: 'warning',
        category: 'Performance',
        title: 'Slow Page Speed',
        description: 'Page appears to load slowly based on content size.',
        impact: 'High'
      });
      recommendations.push('Optimize images and reduce page size for better performance');
    }

    // Success cases
    if (seoElements.title && seoElements.titleLength >= 30 && seoElements.titleLength <= 60) {
      issues.push({
        type: 'success',
        category: 'SEO',
        title: 'Good Title Length',
        description: 'Page title is within the optimal length range.',
        impact: 'High'
      });
    }

    if (metrics.security > 90) {
      issues.push({
        type: 'success',
        category: 'Security',
        title: 'HTTPS Enabled',
        description: 'Website uses secure HTTPS protocol.',
        impact: 'High'
      });
    }

    return { issues, recommendations };
  }

  private calculateOverallScore(metrics: SEOAnalysisResult['metrics']): number {
    const weights = {
      seoScore: 0.3,
      performance: 0.25,
      accessibility: 0.2,
      mobileUsability: 0.15,
      security: 0.1
    };

    return Math.round(
      metrics.seoScore * weights.seoScore +
      metrics.performance * weights.performance +
      metrics.accessibility * weights.accessibility +
      metrics.mobileUsability * weights.mobileUsability +
      metrics.security * weights.security
    );
  }
}