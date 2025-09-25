import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Upload, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const RegisterBatch = () => {
  const [formData, setFormData] = useState({
    cropType: "",
    harvestDate: "",
    expiryDate: "",
    quantity: "",
    weight: "",
    location: "",
    description: "",
    pricePerKg: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [batchData, setBatchData] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const cropTypes = [
    "Tomatoes", "Bell Peppers", "Carrots", "Lettuce", "Spinach", 
    "Broccoli", "Cauliflower", "Onions", "Potatoes", "Corn"
  ];

  

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.cropType || !formData.harvestDate || !formData.quantity || !formData.pricePerKg) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to register a batch.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, get the user's profile to get the profile ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Failed to fetch user profile');
      }

      // Generate batch code
      const batchCode = `BATCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Save batch to database
      const { data: batchData, error: batchError } = await supabase
        .from('produce_batches')
        .insert({
          farmer_id: profile.id,
          crop_type: formData.cropType,
          batch_code: batchCode,
          quantity_kg: parseFloat(formData.quantity),
          price_per_kg: parseFloat(formData.pricePerKg),
          harvest_date: formData.harvestDate,
          expiry_date: formData.expiryDate,
          status: 'harvested'
        })
        .select()
        .single();

      if (batchError) {
        throw batchError;
      }

      // Generate QR code URL
      const qrUrl = `https://agroconnect.app/trace/${batchData.id}`;
      
      // Update batch with QR code URL
      await supabase
        .from('produce_batches')
        .update({ qr_code_url: qrUrl })
        .eq('id', batchData.id);

      setBatchData(batchData);
      setGeneratedQR(qrUrl);
      setIsSubmitting(false);
      
      toast({
        title: "Batch Registered Successfully",
        description: `Batch ${batchCode} has been saved to the database.`,
      });
    } catch (error) {
      console.error('Error registering batch:', error);
      setIsSubmitting(false);
      toast({
        title: "Registration Failed",
        description: "Failed to register batch. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (generatedQR) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center shadow-medium">
            <CardHeader>
              <div className="w-16 h-16 bg-success rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-success">Batch Registered Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 p-8 rounded-lg">
                <QrCode className="h-32 w-32 mx-auto mb-4 text-foreground" />
                <p className="text-sm text-muted-foreground mb-4">QR Code Generated</p>
                <p className="font-mono text-sm bg-background p-2 rounded border">
                  {generatedQR}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-foreground">
                  <strong>Batch ID:</strong> {batchData?.batch_code}
                </p>
                <p className="text-foreground">
                  <strong>Crop:</strong> {formData.cropType}
                </p>
                <p className="text-foreground">
                  <strong>Quantity:</strong> {formData.quantity} kg
                </p>
                <p className="text-foreground">
                  <strong>Price:</strong> ₹{formData.pricePerKg}/kg
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button>Download QR Code</Button>
                <Button variant="outline">Print Labels</Button>
              </div>

              <Link to="/dashboard">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Register New Batch</h1>
          <p className="text-muted-foreground">
            Create a new produce batch record on the blockchain
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cropType">Crop Type *</Label>
                  <Select value={formData.cropType} onValueChange={(value) => handleInputChange("cropType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map(crop => (
                        <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => handleInputChange("harvestDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    placeholder="e.g., 500 units"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Total Weight</Label>
                  <Input
                    id="weight"
                    placeholder="e.g., 250 lbs"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerKg">Price per KG (₹) *</Label>
                  <Input
                    id="pricePerKg"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 50.00"
                    value={formData.pricePerKg}
                    onChange={(e) => handleInputChange("pricePerKg", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Farm Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Sonoma County, CA"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>

                
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Batch Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about this batch..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Blockchain Record...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-5 w-5" />
                    Register Batch & Generate QR
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default RegisterBatch;