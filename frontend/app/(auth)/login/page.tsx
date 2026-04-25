'use client';

import { useState } from "react";
import Link from "next/link";
import { cn, validateEmail } from "@/lib/utils";
import { auth } from "@/lib/api";
import { setAccessToken } from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface LoginFormData {
    email: string;
    password: string;
    error?: string;
}

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
        error: undefined,
    });

    const [errors, setErrors] = useState<Partial<LoginFormData>>({});
    const router = useRouter();

    const handleChange = (field: keyof LoginFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<LoginFormData> = {}

        if (!formData.email) {
            newErrors.email = "Email required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Incorrect email";
        }

        if (!formData.password) {
            newErrors.password = "Password required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be upper 6 symbols";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async ( e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await auth.login(formData);
                if (response && 'access_token' in response) {
                    setAccessToken(response.access_token);
                    router.push('/dashboard');
                }
            } catch (error) {
                setErrors({ error: "Invalid email or password" });
                console.error("Login error:", error);
            }
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Авторизация</h2>
            <p className="text-xl font-bold text-gray-600 mb-8 text-center"></p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                    id="login-email" 
                    type="email" 
                    value={formData.email} 
                    onChange={e => handleChange("email", e.target.value)}
                    className={cn(
                        "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all",
                        errors.email 
                            ? "border-red-500"
                            : "border-gray-300",
                    )}/>
                    { errors.email && (<p className="mt-1 text-sm text-red-500">{ errors.email }</p>)}
                </div>
                <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                    <input 
                        id="login-password"
                        type="password"
                        value={formData.password}
                        onChange={e => handleChange("password", e.target.value)}
                        className={cn(
                            "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all",
                            errors.password 
                                ? "border-red-500"
                                : "border-gray-300",
                        )}
                        placeholder="******"
                    />
                    { errors.password && (
                        <p className="mt-1 text-sm text-red-500">{ errors.password }</p>
                    )}
                </div>
                { errors.error && (
                    <p className="text-sm text-red-500 text-center">{ errors.error }</p>
                )}
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >Войти</button>

                <p className="text-center text-sm text-gray-600">
                    Нет аккаунта? {" "}
                    <Link
                        href="/auth/register"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >Зарегистрироваться</Link>
                </p>
            </form>
        </>
    )
}