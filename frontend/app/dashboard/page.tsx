'use client';

import { Action } from "@/components/dashboard/Action";
import { Activity } from "@/components/dashboard/Activity";
import { Widget } from "@/components/dashboard/Widget";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
                <p className="text-gray-500 mt-1">Обзор вашего бизнеса</p>
            </div>
            <Widget />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Activity />
                <Action />
            </div>
        </div>
    );
}