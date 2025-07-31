
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { SignalList } from '@/components/SignalList';
import { AuthModal } from '@/components/AuthModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Market = () => {
  const [currentPage, setCurrentPage] = useState('market');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useAuth();

  const categories = [
    { id: 'crypto', label: 'Crypto', color: 'bg-primary' },
    { id: 'macro', label: 'Macro', color: 'bg-warning' },
    { id: 'rwa', label: 'RWA', color: 'bg-success' },
  ];

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // TODO: Implement proper navigation
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Signal Market</h1>
          <p className="text-muted-foreground">
            Discover and unlock premium prediction signals from top performers
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search signals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="default">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Active Signals</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">247</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Resolving Soon</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">34</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Total Volume</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">$2.4M</div>
          </div>
        </div>

        {/* Signal List */}
        <SignalList />
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
