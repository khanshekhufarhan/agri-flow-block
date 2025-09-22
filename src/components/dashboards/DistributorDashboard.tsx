import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Truck, 
  Package, 
  DollarSign,
  TrendingUp,
  Users,
  RotateCcw
} from 'lucide-react';

interface DistributorDashboardProps {
  profile: {
    id: string;
    role: string;
    full_name: string;
    verification_status: string;
  };
}

const DistributorDashboard = ({ profile }: DistributorDashboardProps) => {
  const [stats, setStats] = useState({
    activePurchases: 0,
    totalResales: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch distributor transactions
      const { data: transactions } = await supabase
        .from('supply_chain_tracking')
        .select('*')
        .eq('to_stakeholder_id', profile.id);

      if (transactions) {
        setStats({
          activePurchases: transactions.filter(t => t.transaction_type === 'farmer_to_distributor').length,
          totalResales: transactions.filter(t => t.transaction_type === 'distributor_to_retailer').length,
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
            <CardTitle className="text-sm font-medium">Active Purchases</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePurchases}</div>
            <p className="text-xs text-muted-foreground">From farmers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resales</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResales}</div>
            <p className="text-xs text-muted-foreground">To retailers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Distributor Operations</CardTitle>
          <CardDescription>Manage your distribution business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="hero" className="h-16">
              <Link to="/distributor/scan-produce">
                <div className="text-center">
                  <QrCode className="h-6 w-6 mx-auto mb-2" />
                  <span>Scan & Verify Produce</span>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-16">
              <Link to="/distributor/resale">
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2" />
                  <span>Record Resale</span>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-16">
              <Link to="/distributor/logistics">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2" />
                  <span>Manage Logistics</span>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-16">
              <Link to="/distributor/analytics">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                  <span>View Analytics</span>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Notice for Distributors */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Distributor Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Valid GSTIN number required for verification</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Aadhaar card verification for identity confirmation</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">All transactions recorded on blockchain for transparency</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributorDashboard;