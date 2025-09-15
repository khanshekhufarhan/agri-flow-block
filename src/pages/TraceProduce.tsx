import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Scan, Search, MapPin, Calendar, User, DollarSign, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TraceProduce = () => {
  const [batchId, setBatchId] = useState("");
  const [traceData, setTraceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockTraceData = {
    batchId: "BATCH-2024-001",
    productName: "Organic Tomatoes",
    currentStatus: "Retail Ready",
    qrCode: "QR123456789",
    journey: [
      {
        stage: "Farm Origin",
        actor: "Green Valley Farm",
        location: "Sonoma County, CA",
        timestamp: "2024-01-15T08:00:00Z",
        price: "$2.50/lb",
        details: "Harvested from organic greenhouse. Quality grade A.",
        verified: true
      },
      {
        stage: "Distribution",
        actor: "FreshLink Distributors",
        location: "San Francisco, CA",
        timestamp: "2024-01-16T14:30:00Z",
        price: "$3.20/lb",
        details: "Temperature controlled transport. Quality maintained.",
        verified: true
      },
      {
        stage: "Retail",
        actor: "Whole Foods Market",
        location: "Palo Alto, CA",
        timestamp: "2024-01-17T09:15:00Z",
        price: "$4.99/lb",
        details: "Final retail sale. Available to consumers.",
        verified: true
      }
    ],
    qualityReports: [
      {
        date: "2024-01-15",
        grade: "A",
        pesticides: "None detected",
        organic: true
      }
    ]
  };

  const handleScanQR = () => {
    toast({
      title: "QR Scanner",
      description: "QR scanner functionality would be implemented here using device camera.",
    });
  };

  const handleSearchBatch = () => {
    if (!batchId.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid batch ID.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTraceData(mockTraceData);
      setIsLoading(false);
      toast({
        title: "Trace Found",
        description: "Successfully retrieved produce history.",
      });
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Trace Your Produce
          </h1>
          <p className="text-xl text-muted-foreground">
            Scan QR code or enter batch ID to view complete supply chain history
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-soft">
          <CardHeader>
            <CardTitle className="text-center">Search Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Scanner */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90"
                onClick={handleScanQR}
              >
                <Scan className="mr-2 h-5 w-5" />
                Scan QR Code
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Use your device camera to scan the QR code on the produce
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Manual Search */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Batch ID (e.g., BATCH-2024-001)"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearchBatch} disabled={isLoading}>
                  <Search className="mr-2 h-4 w-4" />
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Try: BATCH-2024-001 for demo data
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trace Results */}
        {traceData && (
          <div className="space-y-6">
            {/* Product Overview */}
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{traceData.productName}</CardTitle>
                    <p className="text-muted-foreground">Batch ID: {traceData.batchId}</p>
                  </div>
                  <Badge variant="secondary" className="bg-success text-white">
                    {traceData.currentStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Harvested: Jan 15, 2024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Origin: Sonoma County, CA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Organic Certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Journey */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Supply Chain Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {traceData.journey.map((step: any, index: number) => (
                    <div key={index} className="relative">
                      {index < traceData.journey.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                      )}
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          step.verified ? 'bg-success' : 'bg-muted'
                        }`}>
                          {step.verified ? (
                            <CheckCircle className="h-6 w-6 text-white" />
                          ) : (
                            <span className="text-white font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{step.stage}</h3>
                              <p className="text-sm text-muted-foreground">{step.actor}</p>
                            </div>
                            <Badge variant="outline">{step.price}</Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{step.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(step.timestamp)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-foreground mt-2">{step.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Reports */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Quality Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {traceData.qualityReports.map((report: any, index: number) => (
                  <div key={index} className="grid md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Grade</p>
                      <Badge variant="secondary">{report.grade}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pesticides</p>
                      <p className="text-sm text-muted-foreground">{report.pesticides}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Organic</p>
                      <Badge variant={report.organic ? "default" : "secondary"}>
                        {report.organic ? "Certified" : "No"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraceProduce;