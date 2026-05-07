import { IUser } from "./users.types";

export interface IAuthResponse {
    accessToken: string;
    user: IUser;
}

export interface IAuthForm {
    email: string;
    password: string;
}

export interface IRegisterForm extends IAuthForm {
    firstName: string;
    lastName: string;
    patronymic?: string;
    confirmPassword: string;
}