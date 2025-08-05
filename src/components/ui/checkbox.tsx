import * as React from "react";
import Check from "lucide-react/dist/esm/icons/check";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      onCheckedChange?.(isChecked);
      onChange?.(e);
    };

    const handleDivClick = () => {
      if (!props.disabled) {
        const newChecked = !checked;
        onCheckedChange?.(newChecked);
        // Disparar evento de mudança no input também
        const inputElement = ref as React.MutableRefObject<HTMLInputElement>;
        if (inputElement?.current) {
          inputElement.current.checked = newChecked;
          const event = new Event('change', { bubbles: true });
          inputElement.current.dispatchEvent(event);
        }
      }
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className="sr-only peer"
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div
          onClick={handleDivClick}
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-primary cursor-pointer",
            "ring-offset-background focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "peer-checked:bg-primary peer-checked:text-primary-foreground",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
            "transition-colors duration-200",
            "flex items-center justify-center",
            "hover:border-primary/80",
            className
          )}
        >
          {checked && (
            <Check className="h-3 w-3 text-current" />
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
