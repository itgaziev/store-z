'use client';

import { Bell, Search, User } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

export const Header: React.FC = () => {
    return (
        <header className="h-16 w-full flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="flex items-center space-x-6">
                <Breadcrumbs />
            </div>
            <div className="flex items-center space-x-4">
                <button className='p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors relative'>
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center space-x-4 ml-4 cursor-pointer group">
                    <div className='flex flex-col items-end mr-2'>
                        <span className='text-sm font-semibold text-slate-700'>John Doe</span>
                        <span className='text-xs text-slate-400'>Administrator</span>
                    </div>
                    <div className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all'>
                        <User className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    </div>
                </div>
            </div>
        </header>
    );
};