import React from 'react';
import Info from 'lucide-react/dist/esm/icons/info';
import X from 'lucide-react/dist/esm/icons/x';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
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
        <DialogContent
          hideCloseButton
          className="p-4 text-sm max-w-xs mx-auto flex flex-col gap-4"
        >

          {typeof content === 'string' ? <p>{content}</p> : content}
          <div className="flex justify-end">
            <DialogClose
              aria-label="Fechar"
              className="flex h-11 w-11 items-center justify-center rounded-full border bg-white text-gray-700 shadow"

            >
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
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
