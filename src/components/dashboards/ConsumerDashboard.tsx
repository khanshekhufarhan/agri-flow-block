import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Search, 
  MapPin, 
  Calendar,
  DollarSign,
  Sprout,
  Truck,
  Store,
  ShoppingCart,
  Eye
} from 'lucide-react';

interface ConsumerDashboardProps {
  profile: {
    id: string;
    role: string;
    full_name: string;
    verification_status: string;
  };
}

const ConsumerDashboard = ({ profile }: ConsumerDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Consumer Welcome */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to AgroConnect</CardTitle>
          <CardDescription className="text-lg">
            Discover the complete journey of your food from farm to plate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Scan QR codes on products or search batch IDs to view the complete supply chain journey, 
            including harvest dates, freshness information, and pricing details.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Trace Your Food</CardTitle>
          <CardDescription>Discover the origin and journey of your produce</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Button asChild variant="hero" className="w-full h-16">
                <Link to="/consumer/scan-qr">
                  <div className="text-center">
                    <QrCode className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-lg">Scan QR Code</span>
                    <p className="text-sm opacity-80">Scan the QR on your product</p>
                  </div>
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter batch ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button asChild>
                  <Link to={`/trace?batch=${searchTerm}`}>
                    <Search className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Or manually enter a batch ID to trace the product
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What You Can Discover */}
      <Card>
        <CardHeader>
          <CardTitle>What You Can Discover</CardTitle>
          <CardDescription>Information available through our transparency system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold">Farm Origin</h4>
              <p className="text-sm text-muted-foreground">
                Farmer details, farm location, harvest date
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <h4 className="font-semibold">Freshness Info</h4>
              <p className="text-sm text-muted-foreground">
                Harvest date, expiry date, quality grade
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="p-3 bg-warning/10 rounded-full w-fit mx-auto">
                <MapPin className="h-6 w-6 text-warning" />
              </div>
              <h4 className="font-semibold">Supply Chain</h4>
              <p className="text-sm text-muted-foreground">
                Complete journey from farmer to retailer
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="p-3 bg-success/10 rounded-full w-fit mx-auto">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <h4 className="font-semibold">Pricing</h4>
              <p className="text-sm text-muted-foreground">
                Original farm price vs final retail price
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supply Chain Journey Example */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Journey</CardTitle>
          <CardDescription>How your food travels from farm to table</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="p-3 bg-primary rounded-full mb-2">
                  <Sprout className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">Farmer</p>
                <p className="text-xs text-muted-foreground">Harvest & Register</p>
              </div>
              
              <div className="flex-1 h-px bg-border"></div>
              
              <div className="text-center">
                <div className="p-3 bg-warning rounded-full mb-2">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">Distributor</p>
                <p className="text-xs text-muted-foreground">Transport & Verify</p>
              </div>
              
              <div className="flex-1 h-px bg-border"></div>
              
              <div className="text-center">
                <div className="p-3 bg-secondary rounded-full mb-2">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">Retailer</p>
                <p className="text-xs text-muted-foreground">Stock & Sell</p>
              </div>
              
              <div className="flex-1 h-px bg-border"></div>
              
              <div className="text-center">
                <div className="p-3 bg-success rounded-full mb-2">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">Consumer</p>
                <p className="text-xs text-muted-foreground">Purchase & Trace</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consumer Benefits */}
      <Card className="border-success/20 bg-success/5">
        <CardHeader>
          <CardTitle className="text-success">Benefits for Consumers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Complete transparency of food origin</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Verify freshness and quality information</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Support direct farmer payments</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Access to pricing breakdowns</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Blockchain-verified authenticity</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Make informed purchasing decisions</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumerDashboard;