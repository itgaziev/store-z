'use client';

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const routeMap: Record<string, { name: string; href: string }> = {
    '/': { name: 'Home', href: '/' },
    '/products': { name: 'Products', href: '/products' },
    '/products/[id]': { name: 'Product Details', href: '/products/[id]' },
    '/warehouses': { name: 'Warehouses', href: '/warehouses' },
    '/warehouses/[id]': { name: 'Warehouse Details', href: '/warehouses/[id]' },
    '/sections': { name: 'Sections', href: '/sections' },
    '/sections/[id]': { name: 'Section Details', href: '/sections/[id]' },
    '/users': { name: 'Users', href: '/users' },
    '/users/[id]': { name: 'User Details', href: '/users/[id]' },
};

export const Breadcrumbs: React.FC = () => {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    return (
        <nav className="flex items-center space-x-2 text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
            <Link 
                href="/" 
                className="flex items-center hover:text-blue-600 transition-colors">
                <Home className="w-4 h-4 mr-1.5" />
                { paths.length === 0 && <span className="text-slate-900">Home</span> }
            </Link>



            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join('/')}`;
                const route = routeMap[Object.keys(routeMap).find(key => {
                    const regex = new RegExp('^' + key.replace(/\[.*?\]/g, '[^/]+') + '$');
                    return regex.test(href);
                })!];
                
                if (!route) return null;

                const isLast = index === paths.length - 1;
                
                return (
                    <span key={index} className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                        <Link 
                            href={href} 
                            className={
                                isLast
                                    ? "text-slate-900 cursor-default"
                                    : "hover:text-blue-600 transition-colors"
                            }
                            onClick={e => isLast && e.preventDefault()}
                        >
                            {route.name}
                        </Link>
                    </span>
                );
            })}
        </nav>
    );
};