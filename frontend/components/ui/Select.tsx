import { cn } from "@/lib/utils";
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { label: string; value: string | number }[];
    error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, className, ...props }, ref) => {
        return (
            <div className='w-full space-y-1.5'>
                { label && <label className='text-sm font-medium text-slate-700'>{label}</label> }
                <select
                    ref={ref}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                        error 
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : 'border-slate-200',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                { error && <p className='text-xs text-red-500'>{error}</p> }
            </div>
        );
});

Select.displayName = 'Select';