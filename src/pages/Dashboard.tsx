import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tractor, 
  Truck, 
  Store, 
  ShoppingCart, 
  Users,
  BarChart3,
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "farmer" | "distributor" | "retailer" | "consumer" | "admin" | null;

const Dashboard = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const roles = [
    {
      id: "farmer" as UserRole,
      title: "Farmer",
      description: "Register batches, manage farm profile, generate QR codes",
      icon: Tractor,
      color: "bg-primary",
      features: ["Batch Registration", "QR Generation", "Quality Reports", "Sales Tracking"]
    },
    {
      id: "distributor" as UserRole,
      title: "Distributor",
      description: "Verify batches, manage transfers, track inventory",
      icon: Truck,
      color: "bg-secondary",
      features: ["Batch Verification", "Transfer Management", "Inventory Tracking", "Price Updates"]
    },
    {
      id: "retailer" as UserRole,
      title: "Retailer",
      description: "Confirm authenticity, update retail prices, manage sales",
      icon: Store,
      color: "bg-success",
      features: ["Authenticity Verification", "Retail Pricing", "Sales Management", "Customer Data"]
    },
    {
      id: "consumer" as UserRole,
      title: "Consumer",
      description: "Trace produce history, verify authenticity",
      icon: ShoppingCart,
      color: "bg-warning",
      features: ["QR Scanning", "History Viewing", "Price Transparency", "Quality Reports"]
    },
    {
      id: "admin" as UserRole,
      title: "Admin",
      description: "System oversight, user management, data export",
      icon: Users,
      color: "bg-destructive",
      features: ["System Monitoring", "User Management", "Data Export", "Analytics"]
    }
  ];

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Choose Your Role
            </h1>
            <p className="text-xl text-muted-foreground">
              Select your role to access the appropriate dashboard
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card 
                key={role.id} 
                className="cursor-pointer hover:shadow-medium transition-shadow duration-300 border-2 hover:border-primary/20"
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${role.color} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                    <role.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <p className="text-muted-foreground">{role.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 text-primary border-primary hover:bg-primary hover:text-primary-foreground" variant="outline">
                    Access Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Role-specific dashboard content
  return (
    <div className="min-h-screen bg-background">
      {selectedRole === "farmer" && <FarmerDashboard />}
      {selectedRole === "distributor" && <DistributorDashboard />}
      {selectedRole === "retailer" && <RetailerDashboard />}
      {selectedRole === "consumer" && <ConsumerDashboard />}
      {selectedRole === "admin" && <AdminDashboard />}
      
      {/* Back to role selection */}
      <div className="fixed bottom-4 right-4">
        <Button onClick={() => setSelectedRole(null)} variant="outline">
          Switch Role
        </Button>
      </div>
    </div>
  );
};

// Farmer Dashboard Component
const FarmerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<Array<{ id: string; crop_type: string; batch_code: string; status: string | null; created_at: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('produce_batches')
        .select('id, crop_type, batch_code, status, created_at')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) {
        setError(error.message);
        setBatches([]);
      } else {
        setBatches(data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Your recent batches and activity</p>
        </div>

        {/* Stats Grid removed since we only show real data */}

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/farmer/register-batch">
                <Button className="w-full justify-start" size="lg">
                  <Tractor className="mr-2 h-5 w-5" />
                  Register New Batch
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Recent Batches</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : batches.length === 0 ? (
                <p className="text-sm text-muted-foreground">No records found</p>
              ) : (
                <div className="space-y-3">
                  {batches.map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{batch.batch_code}</p>
                        <p className="text-sm text-muted-foreground">{batch.crop_type}</p>
                      </div>
                      <div className="text-right">
                        {batch.status && <Badge variant="outline">{batch.status}</Badge>}
                        <p className="text-xs text-muted-foreground mt-1">{new Date(batch.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Placeholder dashboards for other roles
const DistributorDashboard = () => (
  <div className="py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">Distributor Dashboard</h1>
      <p className="text-muted-foreground">Manage batch transfers and verification</p>
    </div>
  </div>
);

const RetailerDashboard = () => (
  <div className="py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">Retailer Dashboard</h1>
      <p className="text-muted-foreground">Manage retail pricing and final sales</p>
    </div>
  </div>
);

const ConsumerDashboard = () => (
  <div className="py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">Consumer Dashboard</h1>
      <p className="text-muted-foreground">Track your purchased products and history</p>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">Admin Dashboard</h1>
      <p className="text-muted-foreground">System oversight and analytics</p>
    </div>
  </div>
);

export default Dashboard;