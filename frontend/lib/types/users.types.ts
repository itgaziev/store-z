import { Column, IFilterTable } from "./table.types";

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
    permissions?: IPermission[];
}

export interface IPermission {
    id: string;
    roleId: string;
    modelName: string;
    access: number;
}

export interface IUserResponse extends IUser {
    password: string; //TODO: Remove later
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface IUserTableRow {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    patronymic?: string;
    isActive: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    roleName: string;
}

export interface IUserColumn extends Column {
    id: keyof IUserTableRow;
}

export const UserColumns: IUserColumn[] = [
    { id: 'id', title: 'ID', width: 80, show: false, sortable: true }, // скрыта по умолчанию
    { id: 'email', title: 'Email', width: 'auto', show: true, sortable: true },
    { id: 'firstName', title: 'Имя', width: 150, show: true, sortable: true },
    { id: 'lastName', title: 'Фамилия', width: 150, show: true, sortable: true },
    { id: 'patronymic', title: 'Отчество', width: 150, show: true, sortable: false },
    { id: 'roleName', title: 'Роль', width: 120, show: true, sortable: true },
    { id: 'isActive', title: 'Статус', width: 100, show: true, sortable: true },
    { id: 'createdAt', title: 'Создан', width: 150, show: true, sortable: true },
    { id: 'updatedAt', title: 'Обновлен', width: 150, show: false, sortable: true }, // скрыта
    { id: 'deletedAt', title: 'Удален', width: 150, show: false, sortable: true },
]

export const UserFilterConfig: IFilterTable[] = [
    { id: 'searchTerm', title: 'Поиск по тексту', type: 'STRING', placeholder: 'Имя, email...' },
    { id: 'isActive', title: 'Только активные сотрудники', type: 'CHECKBOX' },
    {
        id: 'roleId',
        title: 'Роль сотрудника',
        type: 'MODAL',
        endpoint: '/users/roles',
        bindLabel: 'name',
        bindValue: 'id',
        placeholder: 'Нажмите для выбора роли...'
    },
]