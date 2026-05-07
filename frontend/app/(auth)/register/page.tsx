'use client'

import { AuthHeader } from "@/components/ui/AuthHeader";
import { Input } from "@/components/ui/Input";
import { authService } from "@/lib/services/auth.service";
import { IRegisterForm } from "@/lib/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/dist/client/components/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { LOGIN_ROUTE } from "@/lib/constants/routes-name";

export default function RegisterPage() {
    const { push } = useRouter();
    const { register, handleSubmit, reset, formState, watch } = useForm<IRegisterForm>({
        mode: "onChange",
    });

    const { mutate, isError, error } = useMutation({
        mutationKey: ['register'],
        mutationFn: (data: IRegisterForm) => authService.register(data),
        onSuccess() {
            toast.success('Registration successful');
            reset();
            push('/login');
        }
    });

    const onSubmit: SubmitHandler<IRegisterForm> = data => {
        mutate(data);
    }

    const { errors } = formState;

    return (
        <>
            <AuthHeader title="Create an Account" subtitle="Please fill in the details to create your account" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input label="First Name" {...register('firstName', { required: 'First Name is required' })} error={errors.firstName?.message} />
                <Input label="Last Name" {...register('lastName', { required: 'Last Name is required' })} error={errors.lastName?.message} />
                <Input label="Patronymic" {...register('patronymic', { required: 'Patronymic is required' })} error={errors.patronymic?.message} />
                <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
                <Input label="Password" type="password" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
                <Input label="Confirm Password" type="password" {...register('confirmPassword', { required: 'Confirm Password is required', validate: (value) => value === watch('password') || 'Passwords do not match' })} error={errors.confirmPassword?.message} />

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    Зарегистрироваться
                </button>

                <p className="text-center text-sm text-gray-600">
                    Уже есть аккаунт?{" "}
                    <Link href={LOGIN_ROUTE} className="text-blue-600 hover:text-blue-700 font-medium">
                        Войти
                    </Link>
                </p>
            </form>
        </>
    )
}