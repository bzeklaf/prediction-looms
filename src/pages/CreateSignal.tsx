
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { AuthModal } from '@/components/AuthModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useCreateSignal } from '@/hooks/useSignals';
import { useAuth } from '@/hooks/useAuth';

export const CreateSignal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createSignal = useCreateSignal();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('create');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prediction: '',
    confidence: 70,
    stake_amount: 100,
    stake_token: 'USDC',
    category: 'crypto' as 'crypto' | 'macro' | 'rwa',
    time_horizon: '1 week',
    resolution_time: '',
    unlock_price: 10,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      await createSignal.mutateAsync(formData);
      navigate('/market');
    } catch (error) {
      console.error('Error creating signal:', error);
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'market') navigate('/market');
    if (page === 'dashboard') navigate('/dashboard');
  };

  const handleAuthClick = () => {
    if (!user) {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onAuthClick={handleAuthClick}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Signal</h1>
            <p className="text-muted-foreground">
              Share your prediction and earn from successful outcomes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Signal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., BTC will reach $100k by end of year"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Explain the context and reasoning behind your prediction..."
                      required
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="prediction">Prediction Details *</Label>
                    <Textarea
                      id="prediction"
                      value={formData.prediction}
                      onChange={(e) => handleInputChange('prediction', e.target.value)}
                      placeholder="Detailed prediction with specific outcomes and conditions..."
                      required
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="macro">Macro</SelectItem>
                          <SelectItem value="rwa">RWA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Time Horizon *</Label>
                      <Select
                        value={formData.time_horizon}
                        onValueChange={(value) => handleInputChange('time_horizon', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 day">1 Day</SelectItem>
                          <SelectItem value="1 week">1 Week</SelectItem>
                          <SelectItem value="1 month">1 Month</SelectItem>
                          <SelectItem value="3 months">3 Months</SelectItem>
                          <SelectItem value="6 months">6 Months</SelectItem>
                          <SelectItem value="1 year">1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resolution_time">Resolution Date *</Label>
                    <Input
                      id="resolution_time"
                      type="datetime-local"
                      value={formData.resolution_time}
                      onChange={(e) => handleInputChange('resolution_time', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Confidence Level: {formData.confidence}%</Label>
                    <div className="mt-2">
                      <Slider
                        value={[formData.confidence]}
                        onValueChange={(value) => handleInputChange('confidence', value[0])}
                        max={100}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stake_amount">Stake Amount *</Label>
                      <Input
                        id="stake_amount"
                        type="number"
                        value={formData.stake_amount}
                        onChange={(e) => handleInputChange('stake_amount', Number(e.target.value))}
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="unlock_price">Unlock Price ($) *</Label>
                      <Input
                        id="unlock_price"
                        type="number"
                        value={formData.unlock_price}
                        onChange={(e) => handleInputChange('unlock_price', Number(e.target.value))}
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createSignal.isPending}
                  >
                    {createSignal.isPending ? 'Creating Signal...' : 'Create Signal'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline">{formData.category.toUpperCase()}</Badge>
                      <Badge variant="outline" className="text-success">
                        {formData.confidence}% confidence
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">
                      {formData.title || 'Your signal title...'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.description || 'Your description will appear here...'}
                    </p>
                  </div>

                  <div className="bg-muted/30 p-3 rounded border">
                    <div className="text-sm font-medium mb-1">Prediction:</div>
                    <div className="text-sm text-muted-foreground">
                      {formData.prediction || 'Your detailed prediction will appear here...'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Stake</div>
                      <div className="font-semibold">{formData.stake_amount} {formData.stake_token}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Unlock Price</div>
                      <div className="font-semibold">${formData.unlock_price}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Time Horizon</div>
                      <div className="font-semibold">{formData.time_horizon}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Resolution</div>
                      <div className="font-semibold">
                        {formData.resolution_time 
                          ? new Date(formData.resolution_time).toLocaleDateString()
                          : 'Not set'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
