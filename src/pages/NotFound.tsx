import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-signal bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Signal not found</p>
        <p className="text-muted-foreground">The prediction you're looking for doesn't exist or has been resolved.</p>
        <a href="/" className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Return to Market
        </a>
      </div>
    </div>
  );
};

export default NotFound;
