'use client';

import { auth } from "@/lib/api";
import { setAccessToken, setRefreshToken } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await auth.login(data);
            if (response && 'access_token' in response) {
                setAccessToken(response.access_token);
                router.push('/dashboard');
            }
        } catch (error: any) {
            setError("root", { 
                message: error.data?.message || "Invalid email or password" 
            });
        }
    };

    return (
        <div className="bg-white p-8 shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Login to Your Account</h2>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        { ...register('email') }
                        type="email"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:right-blue-500 focus:border-blue-500"
                    />
                    { errors.email && (
                        <p className="text-red-500 text-xs mt-1">{ errors.email.message }</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        { ...register('password') }
                        type="password"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:right-blue-500 focus:border-blue-500"
                    />
                    { errors.password && (
                        <p className="text-red-500 text-xs mt-1">{ errors.password.message }</p>
                    )}
                </div>

                { errors.root && (
                    <p className="text-red-500 text-sm text-center">{ errors.root.message }</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    { isSubmitting ? 'Waiting ...' : 'Log In' }
                </button>
            </form>
        </div>
    );
}