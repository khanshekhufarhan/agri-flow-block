import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  Sprout, 
  Truck, 
  Store, 
  ShoppingCart, 
  Plus, 
  QrCode, 
  TrendingUp, 
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Upload,
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react';
import FarmerDashboard from '@/components/dashboards/FarmerDashboard';
import DistributorDashboard from '@/components/dashboards/DistributorDashboard';
import RetailerDashboard from '@/components/dashboards/RetailerDashboard';
import ConsumerDashboard from '@/components/dashboards/ConsumerDashboard';

interface Profile {
  id: string;
  role: 'farmer' | 'distributor' | 'retailer' | 'consumer';
  full_name: string;
  verification_status: 'pending' | 'verified' | 'rejected';
}

const EnhancedDashboard = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No profile found, redirect to registration
            return;
          }
          throw error;
        }

        setProfile(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !loading) {
      fetchProfile();
    }
  }, [user, loading]);

  // Define helper functions first to avoid hook order issues
  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-success text-success-foreground">Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending Verification</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Verification Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown Status</Badge>;
    }
  };

  const renderRoleSpecificDashboard = () => {
    if (!profile) return null;
    
    switch (profile.role) {
      case 'farmer':
        return <FarmerDashboard profile={profile} />;
      case 'distributor':
        return <DistributorDashboard profile={profile} />;
      case 'retailer':
        return <RetailerDashboard profile={profile} />;
      case 'consumer':
        return <ConsumerDashboard profile={profile} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  // Redirect to auth if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to registration if no profile
  if (!loading && user && !isLoading && !profile) {
    return <Navigate to="/register" replace />;
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome, {profile.full_name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} Dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {getVerificationBadge(profile.verification_status)}
            </div>
          </div>
        </div>

        {/* Verification Alert */}
        {profile.verification_status === 'pending' && (
          <Card className="mb-6 border-warning bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-warning mr-2" />
                <div>
                  <p className="font-semibold text-warning">Verification Pending</p>
                  <p className="text-sm text-muted-foreground">
                    Your account is under review. Some features may be limited until verification is complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {profile.verification_status === 'verified' && (
          <Card className="mb-6 border-success bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success mr-2" />
                <div>
                  <p className="font-semibold text-success">Account Verified</p>
                  <p className="text-sm text-muted-foreground">
                    Your account has been verified. You have access to all features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Role-specific Dashboard */}
        {renderRoleSpecificDashboard()}
      </div>
    </div>
  );
};

export default EnhancedDashboard;