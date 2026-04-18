import { getAccessToken } from "@/lib/api-client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1 className="text-white text-shadow-lg text-3xl">Wellcome to StoreZ</h1>
            { getAccessToken() 
                ? <Link href="/login" className="mt-5 py-2 text-white px-12 rounded-full border border-amber-500 hover:bg-amber-700 hover:text-black transition-all">Login Page</Link>
                : <Link href="/dashboard" className="mt-5 py-2 text-white px-12 rounded-full border border-amber-500 hover:bg-amber-700 hover:text-black transition-all">Dashboard Page</Link>
            }
        </div>
    );
}
