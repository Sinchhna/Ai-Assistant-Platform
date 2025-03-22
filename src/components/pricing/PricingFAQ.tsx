
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PricingFAQ = () => {
  return (
    <section className="container max-w-4xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center mb-12">
        Frequently Asked Questions
      </h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How does the billing work?</AccordionTrigger>
          <AccordionContent>
            All plans are billed at the beginning of each billing cycle. For monthly plans, you'll be charged every month on the same date. For annual plans, you'll be charged once per year. You can upgrade or downgrade your plan at any time, and we'll prorate the difference.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>Can I upgrade or downgrade my plan later?</AccordionTrigger>
          <AccordionContent>
            Yes, you can change your plan at any time. If you upgrade, you'll be charged the prorated difference for the remainder of your billing cycle. If you downgrade, you'll receive a prorated credit toward your next billing cycle.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>What happens if I exceed my API call limit?</AccordionTrigger>
          <AccordionContent>
            If you exceed your monthly API call limit, additional calls will be charged at a pay-as-you-go rate. You'll receive notifications as you approach your limit, so you won't be surprised by any additional charges. You can also set spending limits to prevent unexpected costs.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
          <AccordionContent>
            Yes, all paid plans come with a 14-day free trial. You can try out all the features before committing to a paid subscription. No credit card is required to start your trial.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger>How secure is my data?</AccordionTrigger>
          <AccordionContent>
            We take security seriously. All data is encrypted both in transit and at rest. We implement industry-standard security practices, including regular security audits and penetration testing. Our platform is fully GDPR compliant, and we offer data processing agreements for Enterprise customers.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-6">
          <AccordionTrigger>Do you offer custom plans?</AccordionTrigger>
          <AccordionContent>
            Yes, we offer custom plans for organizations with specific needs. Contact our sales team to discuss your requirements, and we'll create a tailored solution for you.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default PricingFAQ;
