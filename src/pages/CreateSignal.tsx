import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  PlusCircle, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SignalForm {
  title: string;
  description: string;
  prediction: string;
  category: string;
  confidence: number;
  stake: number;
  stakeToken: string;
  resolutionDate: string;
  resolutionTime: string;
  unlockPrice: number;
  targetAsset: string;
  predictionType: string;
}

export const CreateSignal = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<SignalForm>({
    title: "",
    description: "",
    prediction: "",
    category: "",
    confidence: 75,
    stake: 50,
    stakeToken: "USDC",
    resolutionDate: "",
    resolutionTime: "",
    unlockPrice: 5,
    targetAsset: "",
    predictionType: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "crypto", label: "Cryptocurrency", icon: "₿" },
    { value: "macro", label: "Macroeconomics", icon: "📈" },
    { value: "rwa", label: "Real World Assets", icon: "🏢" },
  ];

  const predictionTypes = [
    { value: "price_target", label: "Price Target" },
    { value: "price_range", label: "Price Range" },
    { value: "binary", label: "Yes/No Outcome" },
    { value: "ranking", label: "Asset Ranking" },
    { value: "event", label: "Event Occurrence" },
  ];

  const stakeTokens = ["USDC", "USDT", "ETH", "WBTC"];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSubmitting(false);
    // Reset form or redirect
    console.log("Signal submitted:", form);
  };

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return form.title && form.description && form.category && form.predictionType;
      case 2:
        return form.prediction && form.targetAsset && form.confidence;
      case 3:
        return form.stake && form.resolutionDate && form.resolutionTime;
      case 4:
        return form.unlockPrice;
      default:
        return false;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-success";
    if (confidence >= 60) return "text-warning";
    return "text-destructive";
  };

  const steps = [
    { number: 1, title: "Basic Info", description: "Signal title and category" },
    { number: 2, title: "Prediction", description: "Define your prediction" },
    { number: 3, title: "Parameters", description: "Stake and resolution time" },
    { number: 4, title: "Monetization", description: "Unlock pricing" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-signal bg-clip-text text-transparent">
          Create Signal
        </h1>
        <p className="text-muted-foreground">
          Submit a new prediction and stake your reputation
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((stepInfo, index) => (
            <div key={stepInfo.number} className="flex-1">
              <div className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    step >= stepInfo.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > stepInfo.number ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    stepInfo.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-4",
                      step > stepInfo.number ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium">{stepInfo.title}</div>
                <div className="text-xs text-muted-foreground">{stepInfo.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" />
            Step {step}: {steps[step - 1].title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Signal Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. ETH to Break $3,200 in 7 Days"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Explain your reasoning and analysis behind this prediction..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            {cat.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Prediction Type *</Label>
                  <Select value={form.predictionType} onValueChange={(value) => setForm({ ...form, predictionType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {predictionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Prediction */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="targetAsset">Target Asset/Event *</Label>
                <Input
                  id="targetAsset"
                  placeholder="e.g. ETH/USD, Apple Stock, Fed Interest Rate"
                  value={form.targetAsset}
                  onChange={(e) => setForm({ ...form, targetAsset: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prediction">Specific Prediction *</Label>
                <Textarea
                  id="prediction"
                  placeholder="e.g. ETH/USD > $3,200 by August 7, 2024 23:59 UTC"
                  value={form.prediction}
                  onChange={(e) => setForm({ ...form, prediction: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>Confidence Level: {form.confidence}%</Label>
                <Slider
                  value={[form.confidence]}
                  onValueChange={(value) => setForm({ ...form, confidence: value[0] })}
                  max={95}
                  min={51}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>51% (Slight edge)</span>
                  <span className={getConfidenceColor(form.confidence)}>
                    {form.confidence}% ({form.confidence >= 80 ? "High" : form.confidence >= 60 ? "Medium" : "Low"} confidence)
                  </span>
                  <span>95% (Very confident)</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Parameters */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stake">Stake Amount *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="stake"
                      type="number"
                      placeholder="50"
                      value={form.stake}
                      onChange={(e) => setForm({ ...form, stake: Number(e.target.value) })}
                    />
                    <Select value={form.stakeToken} onValueChange={(value) => setForm({ ...form, stakeToken: value })}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stakeTokens.map((token) => (
                          <SelectItem key={token} value={token}>
                            {token}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Resolution Date *</Label>
                  <Input
                    type="date"
                    value={form.resolutionDate}
                    onChange={(e) => setForm({ ...form, resolutionDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Resolution Time (UTC) *</Label>
                <Input
                  type="time"
                  value={form.resolutionTime}
                  onChange={(e) => setForm({ ...form, resolutionTime: e.target.value })}
                />
              </div>

              <div className="bg-muted/20 p-4 rounded-lg border border-border/30">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Stake Information</p>
                    <p className="text-muted-foreground mt-1">
                      Your stake will be locked until resolution. If your prediction is correct, you'll receive your stake back plus rewards. 
                      If incorrect, a portion may be slashed based on accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Monetization */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="unlockPrice">Unlock Price (USD) *</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="unlockPrice"
                    type="number"
                    placeholder="5"
                    value={form.unlockPrice}
                    onChange={(e) => setForm({ ...form, unlockPrice: Number(e.target.value) })}
                    step="0.01"
                    min="0.01"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  How much users will pay to unlock your signal details
                </p>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium text-primary mb-3">Revenue Split</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You receive (90%)</span>
                    <span className="font-medium">${(form.unlockPrice * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protocol fee (10%)</span>
                    <span className="font-medium">${(form.unlockPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total unlock price</span>
                    <span className="text-primary">${form.unlockPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-card/30 p-4 rounded-lg border border-border/30">
                <h4 className="font-medium mb-3">Signal Preview</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {form.title || "Not set"}</div>
                  <div><strong>Category:</strong> {form.category || "Not set"}</div>
                  <div><strong>Confidence:</strong> <span className={getConfidenceColor(form.confidence)}>{form.confidence}%</span></div>
                  <div><strong>Stake:</strong> {form.stake} {form.stakeToken}</div>
                  <div><strong>Resolution:</strong> {form.resolutionDate} {form.resolutionTime} UTC</div>
                  <div><strong>Unlock Price:</strong> ${form.unlockPrice}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 4 ? (
              <Button 
                variant="signal"
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid(step)}
              >
                Next Step
              </Button>
            ) : (
              <Button 
                variant="premium"
                onClick={handleSubmit}
                disabled={!isStepValid(step) || isSubmitting}
                className="min-w-[140px]"
              >
                {isSubmitting ? "Submitting..." : "Submit Signal"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};