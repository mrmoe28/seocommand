import { KeywordRankingsTable } from '@/components/dashboard/keyword-rankings-table';
import { SEOScoreCard } from '@/components/dashboard/seo-score-card';
import { CTRChart } from '@/components/dashboard/ctr-chart';
import { StatsCards } from '@/components/dashboard/stats-cards';

// Mock data for development
const mockSite = {
  id: 1,
  userId: "demo-user",
  url: "https://example.com",
  domain: "example.com",
  createdAt: new Date("2025-08-15T10:00:00Z"),
};

const mockKeywords = [
  {
    id: 1,
    siteId: 1,
    keyword: "seo tools",
    position: 2,
    clicks: 142,
    impressions: 3247,
    ctr: 0.0437,
    date: "2025-08-15",
  },
  {
    id: 2,
    siteId: 1,
    keyword: "keyword research",
    position: 7,
    clicks: 89,
    impressions: 2156,
    ctr: 0.0413,
    date: "2025-08-15",
  },
  {
    id: 3,
    siteId: 1,
    keyword: "search engine optimization",
    position: 3,
    clicks: 203,
    impressions: 5891,
    ctr: 0.0345,
    date: "2025-08-15",
  },
  {
    id: 4,
    siteId: 1,
    keyword: "website analytics",
    position: 15,
    clicks: 34,
    impressions: 1423,
    ctr: 0.0239,
    date: "2025-08-15",
  },
  {
    id: 5,
    siteId: 1,
    keyword: "google search console",
    position: 5,
    clicks: 67,
    impressions: 1876,
    ctr: 0.0357,
    date: "2025-08-14",
  },
];

const mockRecommendations = [
  "Improve meta titles and descriptions for better CTR",
  "Focus on long-tail keywords for better rankings",
  "Optimize page load speed for better user experience",
  "Create more quality backlinks to improve domain authority"
];

export default async function DashboardPage() {
  // Mock data calculations
  const totalSites = 3;
  const totalKeywords = mockKeywords.length;
  const averagePosition = mockKeywords.reduce((sum, k) => sum + (k.position || 0), 0) / mockKeywords.length;
  const averageCTR = mockKeywords.reduce((sum, k) => sum + (k.ctr || 0), 0) / mockKeywords.length;
  const seoScore = 75;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's how your SEO is performing.
        </p>
      </div>

      <StatsCards 
        totalSites={totalSites}
        totalKeywords={totalKeywords}
        averagePosition={averagePosition}
        averageCTR={averageCTR}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <SEOScoreCard 
          score={seoScore}
          recommendations={mockRecommendations}
        />
        <CTRChart keywords={mockKeywords} />
      </div>

      <KeywordRankingsTable 
        keywords={mockKeywords} 
        site={mockSite}
        seoScore={seoScore}
        recommendations={mockRecommendations}
      />
    </div>
  );
}