
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onTrailingIconClick?: () => void;
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ 
    className, 
    label, 
    error, 
    icon,
    trailingIcon,
    onTrailingIconClick,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="space-y-2 w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
          >
            {label}
          </label>
        )}
        
        <div 
          className={cn(
            "relative rounded-xl border transition-all duration-200",
            isFocused ? "ring-2 ring-primary/20 border-primary" : "ring-0",
            error ? "border-red-500 dark:border-red-400" : "border-input",
          )}
        >
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          
          <Input
            ref={ref}
            className={cn(
              "border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
              icon && "pl-10",
              trailingIcon && "pr-10",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {trailingIcon && (
            <div 
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
              onClick={onTrailingIconClick}
            >
              {trailingIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 animate-slide-in">{error}</p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';
