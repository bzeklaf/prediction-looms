import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Award, 
  BarChart3,
  Target,
  Zap
} from "lucide-react";
import { SignalCard } from "@/components/SignalCard";
import { AlphaScoreBadge } from "@/components/AlphaScoreBadge";

// Mock user data
const userData = {
  alphaScore: 87,
  totalSignals: 23,
  accuracy: 0.74,
  totalEarnings: 2840,
  activeSignals: 5,
  resolvedSignals: 18,
  totalStaked: 450,
  rank: 42,
};

const mockUserSignals = [
  {
    id: "user-1",
    creator: "0x1234...5678", // Current user
    title: "SOL to Outperform ETH in Q3",
    description: "Solana's ecosystem growth and upcoming catalyst events will drive SOL/ETH ratio higher.",
    prediction: "SOL/ETH ratio > 0.065 by September 30, 2024",
    confidence: 82,
    stake: 75,
    stakeToken: "USDC",
    resolutionTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    category: "crypto" as const,
    isLocked: false,
    unlockPrice: 4,
    alphaScore: 87,
    timeHorizon: "12 days",
    status: "active" as const,
  },
  {
    id: "user-2", 
    creator: "0x1234...5678",
    title: "Apple iPhone 16 Sales Beat",
    description: "AI features and improved camera will drive strong Q4 iPhone sales beyond analyst expectations.",
    prediction: "AAPL Q4 iPhone revenue > $42B (consensus: $40B)",
    confidence: 76,
    stake: 100,
    stakeToken: "USDC", 
    resolutionTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: "rwa" as const,
    isLocked: false,
    unlockPrice: 6,
    alphaScore: 87,
    timeHorizon: "45 days",
    status: "resolved" as const,
    accuracy: 0.89,
  },
];

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Alpha Score",
      value: userData.alphaScore,
      change: "+5",
      icon: Award,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Earnings",
      value: `$${userData.totalEarnings.toLocaleString()}`,
      change: "+$340",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Accuracy Rate",
      value: `${Math.round(userData.accuracy * 100)}%`,
      change: "+2.1%",
      icon: Target,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Active Signals",
      value: userData.activeSignals,
      change: "+2",
      icon: Zap,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const recentActivity = [
    {
      type: "signal_resolved",
      title: "Apple iPhone 16 Sales Beat",
      result: "Correct",
      earnings: "+$89",
      time: "2 hours ago",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      type: "signal_unlocked",
      title: "ETH Price Prediction",
      earnings: "+$4.50",
      time: "1 day ago", 
      icon: DollarSign,
      color: "text-primary",
    },
    {
      type: "signal_created",
      title: "SOL to Outperform ETH in Q3",
      stake: "-$75",
      time: "3 days ago",
      icon: BarChart3,
      color: "text-warning",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-alpha bg-clip-text text-transparent">
            Creator Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your signals, earnings, and Alpha Score performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AlphaScoreBadge 
            score={userData.alphaScore} 
            accuracy={userData.accuracy}
            totalSignals={userData.totalSignals}
            showDetails={true}
          />
          <Button variant="signal">
            Create New Signal
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card/50 border-border/50 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs flex items-center gap-1 ${stat.color}`}>
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="signals">My Signals</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart Placeholder */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center border border-border/30">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Alpha Score trend chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted/30`}>
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.earnings && (
                          <p className={`text-sm font-medium ${activity.color}`}>
                            {activity.earnings}
                          </p>
                        )}
                        {activity.stake && (
                          <p className="text-sm text-muted-foreground">
                            {activity.stake}
                          </p>
                        )}
                        {activity.result && (
                          <Badge className="bg-success/20 text-success border-success/30">
                            {activity.result}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Your Signals</h3>
              <p className="text-sm text-muted-foreground">
                {userData.activeSignals} active • {userData.resolvedSignals} resolved
              </p>
            </div>
            <Button variant="signal">
              Create Signal
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockUserSignals.map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onView={(id) => console.log("View signal:", id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Signal Sales</p>
                  <p className="text-2xl font-bold text-primary">$2,240</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Stake Rewards</p>
                  <p className="text-2xl font-bold text-success">$600</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Staked</p>
                  <p className="text-2xl font-bold text-warning">${userData.totalStaked}</p>
                </div>
              </div>

              <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center border border-border/30">
                <div className="text-center text-muted-foreground">
                  <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Earnings chart would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};