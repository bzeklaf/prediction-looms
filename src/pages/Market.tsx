import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, Clock, DollarSign, Zap, Target, Award } from "lucide-react";
import { SignalCard } from "@/components/SignalCard";
import { UnlockModal } from "@/components/UnlockModal";
import heroImage from "@/assets/signal-hero.jpg";

// Mock data for signals
const mockSignals = [
  {
    id: "1",
    creator: "0x1234...5678",
    title: "ETH to Break $3,200 in 7 Days",
    description: "Based on technical analysis and upcoming ETF approvals, ETH is likely to surpass $3,200 within the next week.",
    prediction: "ETH/USD > $3,200 by 2024-08-07 23:59 UTC",
    confidence: 85,
    stake: 50,
    stakeToken: "USDC",
    resolutionTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    category: "crypto" as const,
    isLocked: true,
    unlockPrice: 5,
    alphaScore: 87,
    timeHorizon: "7 days",
    status: "active" as const,
  },
  {
    id: "2",
    creator: "0x9876...4321",
    title: "Fed Will Cut Rates by 50bps",
    description: "Economic indicators suggest the Federal Reserve will implement a significant rate cut in the next FOMC meeting.",
    prediction: "Fed Funds Rate will decrease by 0.50% in September 2024 meeting",
    confidence: 72,
    stake: 100,
    stakeToken: "USDC",
    resolutionTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    category: "macro" as const,
    isLocked: false,
    unlockPrice: 8,
    alphaScore: 94,
    timeHorizon: "14 days",
    status: "active" as const,
  },
  {
    id: "3",
    creator: "0x5555...9999",
    title: "Tesla Q3 Earnings Beat",
    description: "Tesla's Q3 earnings will exceed analyst expectations driven by strong Model Y sales and energy storage growth.",
    prediction: "TSLA Q3 2024 EPS > $0.75 (consensus: $0.60)",
    confidence: 68,
    stake: 75,
    stakeToken: "USDC",
    resolutionTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    category: "rwa" as const,
    isLocked: true,
    unlockPrice: 3,
    alphaScore: 76,
    timeHorizon: "21 days",
    status: "active" as const,
  },
  {
    id: "4",
    creator: "0x1111...2222",
    title: "Bitcoin Dominance Below 50%",
    description: "Altcoin season incoming - Bitcoin dominance will fall below 50% as altcoins rally.",
    prediction: "BTC Dominance < 50% by end of August 2024",
    confidence: 91,
    stake: 200,
    stakeToken: "USDC",
    resolutionTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    category: "crypto" as const,
    isLocked: false,
    unlockPrice: 12,
    alphaScore: 88,
    timeHorizon: "5 days",
    status: "resolved" as const,
    accuracy: 0.95,
  },
];

export const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("alpha-score");
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  const filteredSignals = mockSignals.filter(signal => {
    const matchesSearch = signal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || signal.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedSignals = [...filteredSignals].sort((a, b) => {
    switch (sortBy) {
      case "alpha-score": return b.alphaScore - a.alphaScore;
      case "confidence": return b.confidence - a.confidence;
      case "stake": return b.stake - a.stake;
      case "time": return a.resolutionTime.getTime() - b.resolutionTime.getTime();
      default: return 0;
    }
  });

  const handleUnlock = (signalId: string) => {
    const signal = mockSignals.find(s => s.id === signalId);
    if (signal) {
      setSelectedSignal({
        ...signal,
        creatorAlpha: signal.alphaScore,
      });
      setIsUnlockModalOpen(true);
    }
  };

  const handleUnlockConfirm = async () => {
    // Mock unlock logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUnlockModalOpen(false);
    setSelectedSignal(null);
    // In real app, would update signal lock status
  };

  const stats = [
    { label: "Active Signals", value: "1,247", icon: TrendingUp },
    { label: "Total Volume", value: "$2.4M", icon: DollarSign },
    { label: "Avg Accuracy", value: "73.2%", icon: TrendingUp },
    { label: "Avg Resolution", value: "8.5 days", icon: Clock },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/90" />
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Signal Protocol Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-signal bg-clip-text text-transparent">
                Decentralized Prediction Protocol
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Discover premium forecasts from top predictors. Stake, verify, and monetize predictions across crypto, macro, and real-world assets.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="signal" size="lg" className="text-lg px-8 py-6">
                <Zap className="w-5 h-5 mr-2" />
                Explore Signals
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Target className="w-5 h-5 mr-2" />
                Create Prediction
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Alpha Scoring</h3>
                <p className="text-sm text-muted-foreground">Reputation system based on prediction accuracy</p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold">Monetize Predictions</h3>
                <p className="text-sm text-muted-foreground">Earn from signal unlocks and stake rewards</p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <h3 className="font-semibold">Oracle Resolution</h3>
                <p className="text-sm text-muted-foreground">Automated verification via Chainlink oracles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search signals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
                <SelectItem value="macro">Macro</SelectItem>
                <SelectItem value="rwa">RWA</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alpha-score">Alpha Score</SelectItem>
                <SelectItem value="confidence">Confidence</SelectItem>
                <SelectItem value="stake">Stake Amount</SelectItem>
                <SelectItem value="time">Time Left</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {sortedSignals.length} signals
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              {sortedSignals.filter(s => s.status === "active").length} Active
            </Badge>
            <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/30">
              {sortedSignals.filter(s => s.status === "resolved").length} Resolved
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onUnlock={handleUnlock}
              onView={(id) => console.log("View signal:", id)}
            />
          ))}
        </div>
      </div>

      {/* Unlock Modal */}
      {selectedSignal && (
        <UnlockModal
          isOpen={isUnlockModalOpen}
          onClose={() => setIsUnlockModalOpen(false)}
          onConfirm={handleUnlockConfirm}
          signal={selectedSignal}
        />
      )}
      </div>
    </div>
  );
};