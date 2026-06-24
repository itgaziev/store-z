'use client';
import { Heading } from "@/components/layout/Heading";

export default function DemoPage() {
    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col overflow-x-hidden">
            <Heading title="Демо" description="Здесь вы можете протестировать компоненты, которые будут использоваться в вашем магазине" />
        </div>
    );
}