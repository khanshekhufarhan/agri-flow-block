import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skills = [
  {
    id: "crop-management",
    title: "Crop Management",
    description: "Best practices for crop planning, soil testing, and input selection.",
  },
  {
    id: "smart-irrigation",
    title: "Smart Irrigation",
    description: "Irrigation scheduling, drip systems, and water-use efficiency.",
  },
  {
    id: "organic-farming",
    title: "Organic Farming",
    description: "Natural inputs, certification overview, and pest/disease control.",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing for Farmers",
    description: "Branding, marketplaces, and direct-to-consumer strategies.",
  },
];

const SkillCenter = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Skill Center</h1>
          <p className="text-muted-foreground mt-1">Learn new skills and improve your farm operations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Learning Resources</CardTitle>
            <CardDescription>Expandable modules to be enhanced with videos and links</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {skills.map((s) => (
                <AccordionItem key={s.id} value={s.id}>
                  <AccordionTrigger>{s.title}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillCenter;


