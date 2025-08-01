import React from 'react';
import Info from 'lucide-react/dist/esm/icons/info';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveInfoProps {
  content: React.ReactNode;
}

const ResponsiveInfo: React.FC<ResponsiveInfoProps> = ({ content }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Info className="w-3 h-3 text-gray-500 cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="p-4 text-sm max-w-xs mx-auto">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-3 h-3 text-gray-500 cursor-pointer" />
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};

export default ResponsiveInfo;
