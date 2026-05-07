'use client';

import Link from "next/link";
import { cn, validateEmail } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAuthForm } from "@/lib/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.service";
import { toast } from "sonner";
import { DASHBOARD_ROUTE, REGISTER_ROUTE } from "@/lib/constants/routes-name";
import { EMAIL_PATTERN } from "@/lib/constants/patterns";
import { Input } from "@/components/ui/Input";
import { AuthHeader } from "@/components/ui/AuthHeader";

export default function LoginPage() {
    const { push } = useRouter();

    const { register, handleSubmit, reset, formState } = useForm<IAuthForm>({
        mode: "onChange",
    });

    const { mutate, isError, error } = useMutation({
        mutationKey: ['login'],
        mutationFn: (data: IAuthForm) => authService.login(data),
        onSuccess() {
            toast.success('Login successful');
            reset();
            push(DASHBOARD_ROUTE);
        }
    })

    const onSubmit: SubmitHandler<IAuthForm> = data => {
        mutate(data);
    }

    const emailError = formState.errors.email ? formState.errors.email.type === 'pattern' ? 'Invalid email format' : 'Email is required' : '';
    const passwordError = formState.errors.password ? 'Password is required' : '';

    return (
        <>
            <AuthHeader title="Welcome Back!" subtitle="Please login to your account" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input label="Email" type="email" {...register("email", { required: 'Email is required', pattern: {
                        value: EMAIL_PATTERN,
                        message: 'Invalid email format'
                } })} error={emailError} />
                
                <Input label="Пароль" type="password" {...register("password", { required: 'Password is required' })} error={passwordError} placeholder="******" />

                {isError && (
                    <p className="text-sm text-red-500 text-center">{error?.message}</p>
                )}
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >Войти</button>

                <p className="text-center text-sm text-gray-600">
                    Нет аккаунта? {" "}
                    <Link
                        href={REGISTER_ROUTE}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >Зарегистрироваться</Link>
                </p>
            </form>
        </>
    )
}