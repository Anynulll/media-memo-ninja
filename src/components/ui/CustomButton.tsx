
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'subtle';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    isLoading = false,
    icon,
    iconPosition = 'left',
    children,
    ...props 
  }, ref) => {
    // Define custom variants
    const variantClasses = {
      'subtle': 'bg-primary/10 text-primary hover:bg-primary/20',
    };

    // Combine with shadcn Button component
    return (
      <Button
        ref={ref}
        variant={variant !== 'subtle' ? variant : 'ghost'}
        size={size}
        className={cn(
          variant === 'subtle' && variantClasses.subtle,
          'transition-all duration-300 rounded-xl font-medium',
          isLoading && 'opacity-70 cursor-not-allowed',
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
          </div>
        )}
      </Button>
    );
  }
);

CustomButton.displayName = 'CustomButton';
