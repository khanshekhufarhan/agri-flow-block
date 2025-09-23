import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Edit, Save, X, User, FileText, CreditCard, Truck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Navigate } from "react-router-dom";

interface ProfileData {
  id: string;
  full_name: string;
  mobile_number: string;
  aadhaar_number: string;
  role: string;
  verification_status: string;
  created_at: string;
}

interface FarmerDetails {
  pm_kisan_id: string;
  farm_address: string;
  farm_size_acres: number;
}

interface DistributorDetails {
  business_name: string;
  business_address: string;
  gstin_number: string;
}

interface RetailerDetails {
  business_name: string;
  business_address: string;
  gstin_number: string;
  fssai_license: string;
}

interface TransactionData {
  id: string;
  transaction_type: string;
  quantity_kg: number;
  price_per_kg: number;
  total_amount: number;
  transaction_date: string;
  delivery_date: string;
  batch_id: string;
  crop_type?: string;
  batch_code?: string;
}

const Profile = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [roleDetails, setRoleDetails] = useState<any>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        return;
      }

      setProfile(profileData);
      setEditedName(profileData?.full_name || "");

      // Fetch role-specific details
      if (profileData?.role) {
        await fetchRoleSpecificDetails(profileData.id, profileData.role);
        await fetchTransactions(profileData.id, profileData.role);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoleSpecificDetails = async (profileId: string, role: string) => {
    try {
      if (role === 'farmer') {
        const { data } = await supabase
          .from('farmer_details')
          .select('*')
          .eq('profile_id', profileId)
          .single();
        setRoleDetails(data);
      } else if (role === 'distributor') {
        const { data } = await supabase
          .from('distributor_details')
          .select('*')
          .eq('profile_id', profileId)
          .single();
        setRoleDetails(data);
      } else if (role === 'retailer') {
        const { data } = await supabase
          .from('retailer_details')
          .select('*')
          .eq('profile_id', profileId)
          .single();
        setRoleDetails(data);
      }
    } catch (error) {
      console.error('Error fetching role details:', error);
    }
  };

  const fetchTransactions = async (profileId: string, role: string) => {
    try {
      // Fetch supply chain transactions
      const { data: transactionData } = await supabase
        .from('supply_chain_tracking')
        .select(`
          *,
          produce_batches!inner(crop_type, batch_code)
        `)
        .or(`from_stakeholder_id.eq.${profileId},to_stakeholder_id.eq.${profileId}`)
        .order('transaction_date', { ascending: false });

      setTransactions(transactionData || []);

      // If farmer, also fetch produce batches
      if (role === 'farmer') {
        const { data: batchData } = await supabase
          .from('produce_batches')
          .select('*')
          .eq('farmer_id', profileId)
          .order('created_at', { ascending: false });

        setBatches(batchData || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSaveName = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: editedName })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, full_name: editedName });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Name updated successfully.",
      });
    } catch (error) {
      console.error('Error updating name:', error);
      toast({
        title: "Error",
        description: "Failed to update name.",
        variant: "destructive",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Profile not found. Please complete your registration.</p>
            <Button asChild className="w-full mt-4">
              <a href="/register">Complete Registration</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'farmer': return '🌾';
      case 'distributor': return '🚛';
      case 'retailer': return '🏪';
      case 'consumer': return '👤';
      default: return '👤';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-2xl">
                  {getRoleIcon(profile.role)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-2xl font-bold"
                      />
                    ) : (
                      <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
                    )}
                    {isEditing ? (
                      <div className="flex space-x-1">
                        <Button size="sm" onClick={handleSaveName}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setIsEditing(false);
                          setEditedName(profile.full_name);
                        }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="capitalize">
                      {profile.role}
                    </Badge>
                    <Badge className={getVerificationColor(profile.verification_status)}>
                      {profile.verification_status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">
              <User className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <CreditCard className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            {profile.role === 'farmer' && (
              <TabsTrigger value="batches">
                <FileText className="h-4 w-4 mr-2" />
                Produce Batches
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input value={user.email || ""} disabled />
                  </div>
                  <div>
                    <Label>Mobile Number</Label>
                    <Input value={profile.mobile_number || ""} disabled />
                  </div>
                  {profile.aadhaar_number && (
                    <div>
                      <Label>Aadhaar Number</Label>
                      <Input value={profile.aadhaar_number} disabled />
                    </div>
                  )}
                  <div>
                    <Label>Member Since</Label>
                    <Input value={new Date(profile.created_at).toLocaleDateString()} disabled />
                  </div>
                </div>

                {roleDetails && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4 capitalize">{profile.role} Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.role === 'farmer' && (
                          <>
                            {roleDetails.pm_kisan_id && (
                              <div>
                                <Label>PM-Kisan ID</Label>
                                <Input value={roleDetails.pm_kisan_id} disabled />
                              </div>
                            )}
                            {roleDetails.farm_address && (
                              <div>
                                <Label>Farm Address</Label>
                                <Input value={roleDetails.farm_address} disabled />
                              </div>
                            )}
                            {roleDetails.farm_size_acres && (
                              <div>
                                <Label>Farm Size (Acres)</Label>
                                <Input value={roleDetails.farm_size_acres} disabled />
                              </div>
                            )}
                          </>
                        )}
                        {(profile.role === 'distributor' || profile.role === 'retailer') && (
                          <>
                            {roleDetails.business_name && (
                              <div>
                                <Label>Business Name</Label>
                                <Input value={roleDetails.business_name} disabled />
                              </div>
                            )}
                            {roleDetails.business_address && (
                              <div>
                                <Label>Business Address</Label>
                                <Input value={roleDetails.business_address} disabled />
                              </div>
                            )}
                            {roleDetails.gstin_number && (
                              <div>
                                <Label>GSTIN Number</Label>
                                <Input value={roleDetails.gstin_number} disabled />
                              </div>
                            )}
                            {roleDetails.fssai_license && (
                              <div>
                                <Label>FSSAI License</Label>
                                <Input value={roleDetails.fssai_license} disabled />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Your complete transaction and trading history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No transactions found</p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium capitalize">{transaction.transaction_type}</span>
                          </div>
                          <Badge variant="outline">
                            ₹{transaction.total_amount.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Quantity:</span> {transaction.quantity_kg} kg
                          </div>
                          <div>
                            <span className="font-medium">Price/kg:</span> ₹{transaction.price_per_kg}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(transaction.transaction_date).toLocaleDateString()}
                          </div>
                          {transaction.delivery_date && (
                            <div>
                              <span className="font-medium">Delivery:</span> {new Date(transaction.delivery_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {profile.role === 'farmer' && (
            <TabsContent value="batches">
              <Card>
                <CardHeader>
                  <CardTitle>Produce Batches</CardTitle>
                  <CardDescription>
                    All produce batches you have registered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {batches.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No produce batches found</p>
                  ) : (
                    <div className="space-y-4">
                      {batches.map((batch) => (
                        <div key={batch.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{batch.crop_type}</span>
                              <Badge variant="outline">{batch.batch_code}</Badge>
                            </div>
                            <Badge className={batch.status === 'harvested' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                              {batch.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Quantity:</span> {batch.quantity_kg} kg
                            </div>
                            <div>
                              <span className="font-medium">Price/kg:</span> ₹{batch.price_per_kg}
                            </div>
                            <div>
                              <span className="font-medium">Harvest:</span> {new Date(batch.harvest_date).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Expiry:</span> {new Date(batch.expiry_date).toLocaleDateString()}
                            </div>
                          </div>
                          {batch.quality_grade && (
                            <div className="mt-2">
                              <Badge variant="secondary">Grade: {batch.quality_grade}</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;