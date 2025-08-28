import React from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { Button } from './ui/button';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import type { SessionGroupWithJourney } from '@/services/localSimulationService';
import { cn } from '@/lib/utils';

interface UTMDetailsProps {
  visitor: SessionGroupWithJourney;
}

const UTMDetails: React.FC<UTMDetailsProps> = ({ visitor }) => {
  const [open, setOpen] = React.useState(false);

  const summary = [visitor.utm_source, visitor.utm_medium, visitor.utm_campaign]
    .filter(Boolean)
    .join(' / ') || '-';

  const shortenUrl = (url: string) => {
    try {
      const { hostname, pathname } = new URL(url);
      return `${hostname}${pathname}`;
    } catch {
      return url;
    }
  };

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="text-xs overflow-hidden max-w-[220px]"
    >
      <div className="flex items-center gap-1">
        <div className="truncate">{summary}</div>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            aria-label={open ? 'Esconder detalhes UTM' : 'Mostrar detalhes UTM'}
          >
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', open ? 'rotate-180' : '')}
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-1 space-y-1">
        {visitor.utm_term && (
          <div>
            <strong>utm_term:</strong> {visitor.utm_term}
          </div>
        )}
        {visitor.utm_content && (
          <div>
            <strong>utm_content:</strong> {visitor.utm_content}
          </div>
        )}
        {visitor.landing_page && (
          <div>
            <strong>landing_page:</strong>{' '}
            <a
              href={visitor.landing_page}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {shortenUrl(visitor.landing_page)}
            </a>
          </div>
        )}
        {visitor.referrer && (
          <div>
            <strong>referrer:</strong>{' '}
            <a
              href={visitor.referrer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {shortenUrl(visitor.referrer)}
            </a>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UTMDetails;

