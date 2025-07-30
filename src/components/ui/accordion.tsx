import React, { useState } from 'react';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import { cn } from '@/lib/utils';

interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

// Context para gerenciar estado do accordion
const AccordionContext = React.createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}>({
  openItems: [],
  toggleItem: () => {},
  type: 'single'
});

const AccordionItemContext = React.createContext<{
  value: string;
  isOpen: boolean;
}>({
  value: '',
  isOpen: false
});

// Componente principal Accordion
const Accordion: React.FC<AccordionProps> = ({ 
  type = 'single', 
  collapsible = true, 
  children, 
  className 
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    if (type === 'single') {
      // No modo single, só um item pode estar aberto
      if (openItems.includes(value)) {
        setOpenItems(collapsible ? [] : [value]);
      } else {
        setOpenItems([value]);
      }
    } else {
      // No modo multiple, múltiplos itens podem estar abertos
      setOpenItems(prev => 
        prev.includes(value) 
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={className}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// Componente AccordionItem
const AccordionItem: React.FC<AccordionItemProps> = ({ value, children, className }) => {
  const { openItems } = React.useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={cn('border rounded-lg', className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

// Componente AccordionTrigger
const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className }) => {
  const { toggleItem } = React.useContext(AccordionContext);
  const { value, isOpen } = React.useContext(AccordionItemContext);

  return (
    <button
      onClick={() => toggleItem(value)}
      className={cn(
        'flex justify-between items-center w-full text-left',
        'hover:bg-gray-50 transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          'w-5 h-5 transition-transform duration-200 text-green-500',
          isOpen && 'transform rotate-180'
        )}
      />
    </button>
  );
};

// Componente AccordionContent
const AccordionContent: React.FC<AccordionContentProps> = ({ children, className }) => {
  const { isOpen } = React.useContext(AccordionItemContext);

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-200 ease-in-out',
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}
    >
      <div className={className}>
        {children}
      </div>
    </div>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
