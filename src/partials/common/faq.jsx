import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const defaultFaqItems = [
  {
    title: '1. What is this API key used for?',
    text: "The API key authenticates requests and identifies the calling application or adapter. It enables access to protected routes and allows adapters to communicate securely.",
  },
  {
    title: '2. Can I use one API key for multiple adapters or apps?',
    text: 'Yes. A single key can be used across multiple adapters or apps if they share the same account and authorization scope. For stronger isolation, consider separate keys per environment or app.',
  },
  {
    title: '3. How do I rotate or regenerate my API key?',
    text: 'Rotate or regenerate keys from your account settings. After regeneration, the old key is invalid immediately — update any services that used it to avoid downtime.',
  },
  {
    title: '4. Are API keys tied to specific environments (dev/staging/prod)?',
    text: 'They can be. We recommend issuing separate keys for development, staging, and production to limit blast radius and simplify access control.',
  },
  {
    title: '5. What should I do if a key is leaked or compromised?',
    text: 'Revoke or regenerate the key immediately. Audit recent activity (if available) and update any adapters or services that relied on the compromised key.',
  },
  {
    title: '6. Can I limit what an API key can do?',
    text: 'Yes — assign scopes or permissions to keys where supported (e.g., read-only, write-only, adapter-connection-only). Use scoped keys to minimize risk and adhere to the principle of least privilege.',
  },
];

export function Faq({ items = defaultFaqItems, accordonTitle = "FAQ" }) {
  const generateItems = () => {
    return (
      <Accordion type="single" collapsible>
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.text}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{accordonTitle}</CardTitle>
      </CardHeader>
      <CardContent className="py-3">{generateItems()}</CardContent>
    </Card>
  );
}
