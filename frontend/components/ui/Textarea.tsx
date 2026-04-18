import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, ...props }, ref) => {
    return (
        <div className='w-full space-y-1.5'>
            { label && <label className='text-sm font-medium text-slate-700'>{label}</label> }
            <textarea
                ref={ref}
                className={cn(
                    "flex min-h-20 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    error 
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : 'border-slate-200',
                    className
                )}
                {...props}
            />
            { error && <p className='text-xs text-red-500'>{error}</p> }
        </div>
    );
});
Textarea.displayName = 'Textarea';