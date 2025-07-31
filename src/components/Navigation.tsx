import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  PlusCircle, 
  Search, 
  User, 
  Wallet, 
  Bell,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AlphaScoreBadge } from "./AlphaScoreBadge";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userAlphaScore?: number;
  userBalance?: number;
}

export const Navigation = ({ currentPage, onNavigate, userAlphaScore = 67, userBalance = 1250 }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "market", label: "Market", icon: Search },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "create", label: "Create Signal", icon: PlusCircle },
    { id: "profile", label: "Profile", icon: User },
  ];

  const NavContent = () => (
    <>
      <div className="flex items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "signal" : "ghost"}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.label}</span>
            </Button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-primary">
            3
          </Badge>
        </Button>
        
        <div className="hidden md:flex items-center gap-3">
          <AlphaScoreBadge score={userAlphaScore} />
          <div className="flex items-center gap-1 text-sm">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">${userBalance}</span>
          </div>
        </div>

        <Button variant="outline" size="sm">
          <Wallet className="w-4 h-4 mr-2" />
          Connect
        </Button>
      </div>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-glass">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => onNavigate("market")}
            >
              <div className="w-8 h-8 bg-gradient-signal rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-signal bg-clip-text text-transparent">
                SIGNAL
              </span>
            </div>
            <NavContent />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex h-16 items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => onNavigate("market")}
            >
              <div className="w-8 h-8 bg-gradient-signal rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-signal bg-clip-text text-transparent">
                SIGNAL
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="border-t border-border bg-card/95 backdrop-blur-glass">
              <div className="space-y-2 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? "signal" : "ghost"}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  );
                })}
                
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlphaScoreBadge score={userAlphaScore} />
                    <div className="flex items-center gap-1 text-sm">
                      <Wallet className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">${userBalance}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};