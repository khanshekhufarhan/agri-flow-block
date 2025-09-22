import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  TrendingUp, 
  Package, 
  DollarSign,
  Calendar,
  MapPin,
  Eye
} from 'lucide-react';

interface FarmerDashboardProps {
  profile: {
    id: string;
    role: string;
    full_name: string;
    verification_status: string;
  };
}

const FarmerDashboard = ({ profile }: FarmerDashboardProps) => {
  const [stats, setStats] = useState({
    activeBatches: 0,
    totalRevenue: 0,
    avgPrice: 0,
  });
  const [recentBatches, setRecentBatches] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch produce batches
      const { data: batches } = await supabase
        .from('produce_batches')
        .select('*')
        .eq('farmer_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (batches) {
        setRecentBatches(batches);
        setStats({
          activeBatches: batches.filter(b => b.status !== 'sold_to_consumer').length,
          totalRevenue: batches.reduce((sum, b) => sum + (b.quantity_kg * b.price_per_kg), 0),
          avgPrice: batches.length > 0 ? 
            batches.reduce((sum, b) => sum + b.price_per_kg, 0) / batches.length : 0,
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
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBatches}</div>
            <p className="text-xs text-muted-foreground">Currently in supply chain</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all batches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price/kg</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.avgPrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Average selling price</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your farming operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="hero" className="h-16">
              <Link to="/farmer/register-batch">
                <div className="text-center">
                  <Plus className="h-6 w-6 mx-auto mb-2" />
                  <span>Register New Batch</span>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-16">
              <Link to="/farmer/harvest-dates">
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2" />
                  <span>Set Harvest & Expiry Dates</span>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-16">
              <Link to="/farmer/payments">
                <div className="text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2" />
                  <span>Track Payments</span>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-16">
              <Link to="/farmer/supply-chain">
                <div className="text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2" />
                  <span>Track Supply Chain</span>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Batches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Produce Batches</CardTitle>
          <CardDescription>Your latest registered batches</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBatches.length > 0 ? (
            <div className="space-y-4">
              {recentBatches.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{batch.crop_type}</h4>
                    <p className="text-sm text-muted-foreground">
                      Batch: {batch.batch_code} • {batch.quantity_kg} kg • ₹{batch.price_per_kg}/kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Harvest: {new Date(batch.harvest_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      batch.status === 'harvested' ? 'bg-success/20 text-success' :
                      batch.status === 'in_transit' ? 'bg-warning/20 text-warning' :
                      batch.status === 'at_distributor' ? 'bg-primary/20 text-primary' :
                      batch.status === 'at_retailer' ? 'bg-secondary/20 text-secondary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {batch.status.replace('_', ' ')}
                    </span>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No batches registered yet</p>
              <Button asChild className="mt-4">
                <Link to="/farmer/register-batch">Register Your First Batch</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerDashboard;