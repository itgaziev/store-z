export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    patronymic?: string;
    isActive: boolean;
    role: IRole;
}

export interface IRole {
    id: string;
    code: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    permissions: IPermission[];
}

export interface IPermission {
    id: string;
    roleId: string;
    modelName: string;
    access: number;
}