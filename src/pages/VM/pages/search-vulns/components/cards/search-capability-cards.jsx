import { Filter, Save, Search, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Informational cards explaining what the search supports
 */
export default function SearchCapabilityCards() {
  const cards = [
    {
      title: 'Keyword & CVE Search',
      description:
        'Search vulnerabilities by keywords, CVE IDs (e.g., entries from the CVE list), affected components, or descriptions.',
      icon: Search,
    },
    {
      title: 'Advanced Filtering',
      description:
        'Filter results by severity, status, exploit availability, publication date, or affected assets.',
      icon: Filter,
    },
    {
      title: 'Real-Time Results',
      description:
        'Instantly display matching vulnerabilities as users refine search terms or apply filters.',
      icon: Zap,
    },
    {
      title: 'Saved Searches & Export',
      description:
        'Save frequently used queries and export search results in formats such as CSV or JSON for reporting and analysis.',
      icon: Save,
    },
  ];

  return (
    <div className="mb-6">
      {/* Title & Description */}
      <div className="text-center mb-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold">Advanced Vulnerability Search</h2>
        <p className="text-sm text-muted-foreground mt-2">
          A powerful search functionality that enables users to quickly locate,
          filter, and analyze vulnerabilities within the system using keywords,
          identifiers, severity levels, and other relevant criteria.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <Card key={index} className="border-2 border-muted">
              <CardContent className="p-4 flex gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-md  text-muted-foreground">
                  <Icon size={18} />
                </div>

                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-none">
                    {card.title}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1">
                    {card.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
