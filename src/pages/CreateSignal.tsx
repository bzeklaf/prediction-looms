
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, DollarSign, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const CreateSignal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prediction, setPrediction] = useState("");
  const [category, setCategory] = useState("");
  const [confidence, setConfidence] = useState(50);
  const [stake, setStake] = useState("");
  const [stakeToken, setStakeToken] = useState("USDC");
  const [resolutionDate, setResolutionDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionDate) return;

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Signal submitted:", {
      title,
      description,
      prediction,
      category,
      confidence,
      stake,
      stakeToken,
      resolutionDate,
    });
    
    setIsSubmitting(false);
    // In real app, would redirect to signal page or dashboard
  };

  const isFormValid = title && description && prediction && category && stake && resolutionDate;
  const estimatedUnlockPrice = Math.round((parseFloat(stake) || 0) * 0.1 * 100) / 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-alpha bg-clip-text text-transparent">
            Create New Signal
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Submit your prediction with confidence and stake. Earn from unlock fees and build your Alpha Score.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Signal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., ETH to Break $3,200 in 7 Days"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Explain your reasoning, methodology, and key factors..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-muted/30 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prediction">Specific Prediction</Label>
                    <Textarea
                      id="prediction"
                      placeholder="e.g., ETH/USD > $3,200 by 2024-08-07 23:59 UTC"
                      value={prediction}
                      onChange={(e) => setPrediction(e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-muted/30">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="macro">Macro</SelectItem>
                          <SelectItem value="rwa">Real World Assets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Resolution Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-muted/30",
                              !resolutionDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {resolutionDate ? format(resolutionDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={resolutionDate}
                            onSelect={setResolutionDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-success" />
                    Confidence & Stake
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Confidence Level: {confidence}%</Label>
                    <div className="px-3">
                      <input
                        type="range"
                        min="1"
                        max="99"
                        value={confidence}
                        onChange={(e) => setConfidence(parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low confidence</span>
                      <span>High confidence</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stake">Stake Amount</Label>
                      <Input
                        id="stake"
                        type="number"
                        placeholder="0.00"
                        value={stake}
                        onChange={(e) => setStake(e.target.value)}
                        className="bg-muted/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Stake Token</Label>
                      <Select value={stakeToken} onValueChange={setStakeToken}>
                        <SelectTrigger className="bg-muted/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="WBTC">WBTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Sidebar */}
            <div className="space-y-6">
              <Card className="bg-card/50 border-border/50 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category && (
                    <Badge className={
                      category === "crypto" ? "bg-primary text-primary-foreground" :
                      category === "macro" ? "bg-warning text-warning-foreground" :
                      "bg-success text-success-foreground"
                    }>
                      {category.toUpperCase()}
                    </Badge>
                  )}

                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">
                      {title || "Signal Title"}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {description || "Signal description will appear here..."}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">{confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stake</span>
                      <span className="font-medium">{stake || "0"} {stakeToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Unlock Price</span>
                      <span className="font-medium">${estimatedUnlockPrice}</span>
                    </div>
                    {resolutionDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resolution</span>
                        <span className="font-medium">{format(resolutionDate, "MMM dd")}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-primary mt-0.5" />
                      <div className="text-xs">
                        <div className="font-medium text-primary mb-1">Risk Notice</div>
                        <p className="text-muted-foreground">
                          Your stake will be locked until resolution. Incorrect predictions may result in partial stake loss.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">Ready to Submit?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your signal will be published immediately and available for unlock
                  </p>
                </div>
                <Button 
                  type="submit"
                  variant="signal"
                  size="lg"
                  disabled={!isFormValid || isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Signal"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};
