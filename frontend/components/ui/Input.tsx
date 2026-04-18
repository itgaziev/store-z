import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => {
    return (
        <div className='w-full space-y-1.5'>
            { label && <label className='text-sm font-medium text-slate-700'>{label}</label> }
            <input
                ref={ref}
                className={cn(
                        "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
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

Input.displayName = 'Input';