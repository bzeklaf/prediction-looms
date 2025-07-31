import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Market } from "./Market";
import { Dashboard } from "./Dashboard";
import { CreateSignal } from "./CreateSignal";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("market");

  const renderPage = () => {
    switch (currentPage) {
      case "market":
        return <Market />;
      case "dashboard":
        return <Dashboard />;
      case "create":
        return <CreateSignal />;
      case "profile":
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <p className="text-muted-foreground">Profile page coming soon...</p>
          </div>
        );
      default:
        return <Market />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      {renderPage()}
    </div>
  );
};

export default Index;
