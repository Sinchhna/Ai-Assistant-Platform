
import { Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PricingComparison = () => {
  const features = [
    {
      name: "Community AI Models",
      free: "5 Models",
      pro: "All Models",
      enterprise: "All Models + Premium"
    },
    {
      name: "Monthly API Calls",
      free: "100",
      pro: "10,000",
      enterprise: "Unlimited"
    },
    {
      name: "API Key Management",
      free: false,
      pro: true,
      enterprise: true
    },
    {
      name: "Custom Integrations",
      free: false,
      pro: false,
      enterprise: true
    },
    {
      name: "Support Level",
      free: "Community",
      pro: "Priority Email",
      enterprise: "24/7 Dedicated"
    },
    {
      name: "SLA Guarantees",
      free: false,
      pro: false,
      enterprise: true
    },
    {
      name: "Usage Analytics",
      free: "Basic",
      pro: "Advanced",
      enterprise: "Enterprise"
    },
    {
      name: "Team Members",
      free: "1",
      pro: "5",
      enterprise: "Unlimited"
    },
    {
      name: "White Labeling",
      free: false,
      pro: false,
      enterprise: true
    }
  ];

  return (
    <section className="container max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">
        Compare Plans
      </h2>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Feature</TableHead>
              <TableHead>Free</TableHead>
              <TableHead>Pro</TableHead>
              <TableHead>Enterprise</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{feature.name}</TableCell>
                <TableCell>
                  {typeof feature.free === "boolean" ? (
                    feature.free ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )
                  ) : (
                    feature.free
                  )}
                </TableCell>
                <TableCell>
                  {typeof feature.pro === "boolean" ? (
                    feature.pro ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )
                  ) : (
                    feature.pro
                  )}
                </TableCell>
                <TableCell>
                  {typeof feature.enterprise === "boolean" ? (
                    feature.enterprise ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )
                  ) : (
                    feature.enterprise
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default PricingComparison;
