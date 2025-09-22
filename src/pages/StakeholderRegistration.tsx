import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Upload, Loader2 } from 'lucide-react';

type StakeholderRole = 'farmer' | 'distributor' | 'retailer' | 'consumer';

const StakeholderRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<StakeholderRole | ''>('');
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    aadhaarNumber: '',
    // Farmer specific
    pmKisanId: '',
    farmAddress: '',
    farmSizeAcres: '',
    // Distributor/Retailer specific
    gstinNumber: '',
    businessName: '',
    businessAddress: '',
    // Retailer specific
    fssaiLicense: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAadhaarFile(file);
    }
  };

  const uploadDocument = async (file: File, folder: string): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRole) return;

    setIsLoading(true);

    try {
      // Upload Aadhaar card if provided
      let aadhaarUrl = null;
      if (aadhaarFile) {
        aadhaarUrl = await uploadDocument(aadhaarFile, 'aadhaar');
      }

      // Create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          role: selectedRole,
          full_name: formData.fullName,
          mobile_number: formData.mobileNumber,
          aadhaar_number: formData.aadhaarNumber,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create role-specific details
      if (selectedRole === 'farmer') {
        const { error } = await supabase
          .from('farmer_details')
          .insert({
            profile_id: profile.id,
            pm_kisan_id: formData.pmKisanId,
            aadhaar_card_url: aadhaarUrl,
            farm_address: formData.farmAddress,
            farm_size_acres: formData.farmSizeAcres ? parseFloat(formData.farmSizeAcres) : null,
          });
        if (error) throw error;
      } else if (selectedRole === 'distributor') {
        const { error } = await supabase
          .from('distributor_details')
          .insert({
            profile_id: profile.id,
            gstin_number: formData.gstinNumber,
            aadhaar_card_url: aadhaarUrl,
            business_name: formData.businessName,
            business_address: formData.businessAddress,
          });
        if (error) throw error;
      } else if (selectedRole === 'retailer') {
        const { error } = await supabase
          .from('retailer_details')
          .insert({
            profile_id: profile.id,
            gstin_number: formData.gstinNumber,
            fssai_license: formData.fssaiLicense,
            aadhaar_card_url: aadhaarUrl,
            business_name: formData.businessName,
            business_address: formData.businessAddress,
          });
        if (error) throw error;
      }

      toast({
        title: "Registration Successful",
        description: "Your profile has been created. Awaiting verification.",
        variant: "default",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Complete Your Registration</CardTitle>
            <CardDescription>
              Select your role and provide the required information for verification.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Select Your Role</Label>
                <Select value={selectedRole} onValueChange={(value: StakeholderRole) => setSelectedRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role in the supply chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer/Producer</SelectItem>
                    <SelectItem value="distributor">Distributor/Wholesaler</SelectItem>
                    <SelectItem value="retailer">Retailer</SelectItem>
                    <SelectItem value="consumer">Consumer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {selectedRole !== 'consumer' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                    <Input
                      id="aadhaarNumber"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaarUpload">Upload Aadhaar Card</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="aadhaarUpload"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('aadhaarUpload')?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {aadhaarFile ? aadhaarFile.name : 'Choose File'}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Farmer Specific Fields */}
              {selectedRole === 'farmer' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="pmKisanId">PM-Kisan Registration ID</Label>
                    <Input
                      id="pmKisanId"
                      name="pmKisanId"
                      value={formData.pmKisanId}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmAddress">Farm Address</Label>
                    <Textarea
                      id="farmAddress"
                      name="farmAddress"
                      value={formData.farmAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmSizeAcres">Farm Size (Acres)</Label>
                    <Input
                      id="farmSizeAcres"
                      name="farmSizeAcres"
                      type="number"
                      step="0.1"
                      value={formData.farmSizeAcres}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              {/* Distributor/Retailer Specific Fields */}
              {(selectedRole === 'distributor' || selectedRole === 'retailer') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="gstinNumber">GSTIN Number *</Label>
                    <Input
                      id="gstinNumber"
                      name="gstinNumber"
                      value={formData.gstinNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Textarea
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              {/* Retailer Specific Fields */}
              {selectedRole === 'retailer' && (
                <div className="space-y-2">
                  <Label htmlFor="fssaiLicense">FSSAI License Number *</Label>
                  <Input
                    id="fssaiLicense"
                    name="fssaiLicense"
                    value={formData.fssaiLicense}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !selectedRole}
                variant="hero"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StakeholderRegistration;