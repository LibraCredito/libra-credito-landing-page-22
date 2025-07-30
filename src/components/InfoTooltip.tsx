import React from 'react';
import Info from 'lucide-react/dist/esm/icons/info';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <button type="button" className={className} aria-label="Informações">
            <Info className="w-3 h-3 text-gray-500" />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-4 text-sm text-gray-700">
            <DrawerTitle className="mb-2 text-base font-semibold">Informações</DrawerTitle>
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className={className} aria-label="Informações">
          <Info className="w-3 h-3 text-gray-500" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};

export default InfoTooltip;
