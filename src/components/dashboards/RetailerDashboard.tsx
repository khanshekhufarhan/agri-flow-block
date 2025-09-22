import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Store, 
  Package, 
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Receipt
} from 'lucide-react';

interface RetailerDashboardProps {
  profile: {
    id: string;
    role: string;
    full_name: string;
    verification_status: string;
  };
}

const RetailerDashboard = ({ profile }: RetailerDashboardProps) => {
  const [stats, setStats] = useState({
    totalPurchases: 0,
    consumerSales: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch retailer transactions
      const { data: transactions } = await supabase
        .from('supply_chain_tracking')
        .select('*')
        .eq('to_stakeholder_id', profile.id);

      if (transactions) {
        setStats({
          totalPurchases: transactions.filter(t => t.transaction_type === 'distributor_to_retailer').length,
          consumerSales: transactions.filter(t => t.transaction_type === 'retailer_to_consumer').length,
          totalRevenue: transactions.reduce((sum, t) => sum + t.total_amount, 0),
        });
      }
    };

    fetchData();
  }, [profile.id]);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">From distributors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumer Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consumerSales}</div>
            <p className="text-xs text-muted-foreground">To end consumers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Retail Operations</CardTitle>
          <CardDescription>Manage your retail business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="hero" className="h-16">
              <Link to="/retailer/verify-produce">
                <div className="text-center">
                  <QrCode className="h-6 w-6 mx-auto mb-2" />
                  <span>Verify Produce from Distributor</span>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-16">
              <Link to="/retailer/consumer-sale">
                <div className="text-center">
                  <ShoppingCart className="h-6 w-6 mx-auto mb-2" />
                  <span>Record Consumer Sale</span>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-16">
              <Link to="/retailer/generate-qr">
                <div className="text-center">
                  <QrCode className="h-6 w-6 mx-auto mb-2" />
                  <span>Generate QR for Consumers</span>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-16">
              <Link to="/retailer/analytics">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                  <span>View Analytics</span>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FSSAI Compliance */}
      <Card className="border-secondary/20 bg-secondary/5">
        <CardHeader>
          <CardTitle className="text-secondary">Food Safety Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span className="text-sm">FSSAI license required for food retail operations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span className="text-sm">GSTIN number for tax compliance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span className="text-sm">Aadhaar verification for identity confirmation</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span className="text-sm">Generate QR codes for consumer transparency</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetailerDashboard;