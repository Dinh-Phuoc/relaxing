import * as React from 'react';
import { cn } from '~/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hasLeftIcon?: boolean;
    hasRightIcon?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, hasLeftIcon, hasRightIcon, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'ui-input flex h-10 w-full rounded-lg border border-border bg-white/[0.06] text-sm text-text-primary',
                    'placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-red/50',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    hasLeftIcon && 'ui-input--left-icon',
                    hasRightIcon && 'ui-input--right-icon',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = 'Input';

export { Input };
