import { useState } from "react";
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
                  <Button className="w-full mt-4" variant="outline">
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
  const stats = [
    { label: "Active Batches", value: "24", change: "+12%" },
    { label: "Total Revenue", value: "₹1,26,720", change: "+8%" },
    { label: "QR Codes Generated", value: "156", change: "+15%" },
    { label: "Quality Score", value: "98%", change: "+2%" }
  ];

  const recentBatches = [
    { id: "BATCH-2024-001", crop: "Organic Tomatoes", status: "In Transit", date: "2024-01-15" },
    { id: "BATCH-2024-002", crop: "Bell Peppers", status: "Delivered", date: "2024-01-14" },
    { id: "BATCH-2024-003", crop: "Carrots", status: "Processing", date: "2024-01-13" }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Green Valley Farm</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
              <div className="space-y-3">
                {recentBatches.map((batch, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{batch.id}</p>
                      <p className="text-sm text-muted-foreground">{batch.crop}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{batch.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{batch.date}</p>
                    </div>
                  </div>
                ))}
              </div>
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