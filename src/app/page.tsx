import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, BarChart3, Globe, FileText, ArrowRight } from 'lucide-react';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">SEO SiteWatcher</span>
          </div>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              Monitor Your Website&apos;s{' '}
              <span className="text-blue-600">SEO Health</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track keyword rankings, monitor SEO performance, and analyze Google Search Console data in real-time.
              Get actionable insights to improve your search visibility.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-3">
              <Link href="/auth/signin">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-3">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16" id="features">
            <div className="text-center space-y-4">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Analytics</h3>
              <p className="text-gray-600">
                Monitor keyword rankings, click-through rates, and search performance with live data from Google Search Console.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Multi-site Management</h3>
              <p className="text-gray-600">
                Track multiple websites from a single dashboard. Perfect for agencies and businesses with multiple domains.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Automated Reports</h3>
              <p className="text-gray-600">
                Get SEO scores, recommendations, and detailed reports. Export to PDF or CSV for easy sharing with your team.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mt-16">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h4 className="font-semibold">Connect Your Google Account</h4>
                <p className="text-sm text-gray-600">
                  Securely connect your Google Search Console to access your website data.
                </p>
              </div>
              <div className="space-y-2">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h4 className="font-semibold">Add Your Websites</h4>
                <p className="text-sm text-gray-600">
                  Add the websites you want to monitor and we&apos;ll start tracking their performance.
                </p>
              </div>
              <div className="space-y-2">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h4 className="font-semibold">Monitor & Optimize</h4>
                <p className="text-sm text-gray-600">
                  Get insights, track improvements, and optimize your SEO strategy with our recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 SEO SiteWatcher. Built with Next.js and deployed on Netlify.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
