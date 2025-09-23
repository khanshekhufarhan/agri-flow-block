import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockArticles = [
  {
    id: 1,
    title: "Monsoon Outlook: Preparing Fields for Optimal Yield",
    description: "Tips to manage soil health, sowing schedules, and pest control ahead of the rains.",
  },
  {
    id: 2,
    title: "Market Watch: Vegetable Prices Trend Steady",
    description: "Weekly mandi insights and factors influencing farm-gate pricing across regions.",
  },
  {
    id: 3,
    title: "Government Schemes: Subsidies for Drip Irrigation",
    description: "An overview of eligibility, application process, and benefits for micro-irrigation.",
  },
];

const AgroNews = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Agro News</h1>
          <p className="text-muted-foreground mt-1">Latest updates and insights for the farming community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockArticles.map((article) => (
            <Card key={article.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{article.title}</CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="outline" className="w-full">Read More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgroNews;


