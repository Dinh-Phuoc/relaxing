import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-accent-red/15 text-accent-red',
                secondary: 'border-border bg-surface text-text-secondary',
                outline: 'border-border text-text-secondary',
                quality: 'border-transparent bg-accent-red/90 text-white text-[9px] font-bold px-[5px] py-[2px] rounded-[3px]',
                anime: 'border-transparent bg-indigo-500/90 text-white text-[9px] font-bold px-[5px] py-[2px] rounded-[3px]',
                episode:
                    'border border-white/10 bg-black/80 text-[#e0e0e0] text-[9px] font-semibold px-[5px] py-[2px] rounded-[3px] backdrop-blur-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
