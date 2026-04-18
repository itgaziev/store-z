'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api-client";

export default function AuthGuard({ children } : { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const pathname = usePathname()
    useEffect(() => {
        const token = getAccessToken();
        console.log('AuthGuard token:', token);
        if (!token) {
            console.log(pathname)
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return null;
    }

    return <>{ children }</>
}