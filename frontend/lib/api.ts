import { apiRequest, type ApiResponse, type ApiRequest } from "./api-client";
import { operations } from "./types/schema";

// Helper типы для каждого endpoint
type AuthLoginResponse = ApiResponse<'AuthController_login'>;
type AuthRegisterResponse = ApiResponse<'AuthController_register'>;
type AuthRefreshResponse = ApiResponse<'AuthController_refresh'>;

type UsersCurrentResponse = ApiResponse<'UsersController_findCurrentUser'>;
type UsersListResponse = ApiResponse<'UsersController_findAll'>;
type UsersOneResponse = ApiResponse<'UsersController_findOne'>;
type UsersCreateResponse = ApiResponse<'UsersController_create'>;
type UsersUpdateResponse = ApiResponse<'UsersController_update'>;

type SectionsListResponse = ApiResponse<'SectionsController_findAll'>;
type SectionsOneResponse = ApiResponse<'SectionsController_findOne'>;
type SectionsCreateResponse = ApiResponse<'SectionsController_create'>;
type SectionsUpdateResponse = ApiResponse<'SectionsController_update'>;

type ProductsListResponse = ApiResponse<'ProductsController_findAll'>;
type ProductsOneResponse = ApiResponse<'ProductsController_findOne'>;
type ProductsCreateResponse = ApiResponse<'ProductsController_create'>;
type ProductsUpdateResponse = ApiResponse<'ProductsController_update'>;

type WarehousesListResponse = ApiResponse<'WarehousesController_findAll'>;
type WarehousesOneResponse = ApiResponse<'WarehousesController_findOne'>;
type WarehousesCreateResponse = ApiResponse<'WarehousesController_create'>;
type WarehousesUpdateResponse = ApiResponse<'WarehousesController_update'>;

type ImagesUploadResponse = ApiResponse<'ImagesController_uploadImage'>;
type ImagesSetMainResponse = ApiResponse<'ImagesController_setAsMain'>;

// DTO типы
type LoginDto = ApiRequest<'AuthController_login'>;
type RegisterDto = ApiRequest<'AuthController_register'>;
type CreateUserDto = ApiRequest<'UsersController_create'>;
type UpdateUserDto = ApiRequest<'UsersController_update'>;
type CreateSectionDto = ApiRequest<'SectionsController_create'>;
type UpdateSectionDto = ApiRequest<'SectionsController_update'>;
type CreateProductDto = ApiRequest<'ProductsController_create'>;
type UpdateProductDto = ApiRequest<'ProductsController_update'>;
type CreateWarehouseDto = ApiRequest<'WarehousesController_create'>;
type UpdateWarehouseDto = ApiRequest<'WarehousesController_update'>;

export const auth = {
    login: (data: LoginDto) =>
        apiRequest<AuthLoginResponse>('/auth/login', {
            method: 'POST',
            data,
            requiresAuth: false,
        }),
    register: (data: RegisterDto) =>
        apiRequest<AuthRegisterResponse>('/auth/register', {
            method: 'POST',
            data,
            requiresAuth: false,
        }),
    refreshToken: () =>
        apiRequest<AuthRefreshResponse>('/auth/refresh', {
            method: 'POST',
        })
};

export const users = {
    getCurrent: () =>
        apiRequest<UsersCurrentResponse>('/users/me', {
            method: 'GET',
            requiresAuth: true,
        }),
    getAll: (page: number = 1, limit: number = 10) =>
        apiRequest<UsersListResponse>('/users', {
            method: 'GET',
            query: { page, limit },
            requiresAuth: true,
        }),
    getOne: (id: number) =>
        apiRequest<UsersOneResponse>(`/users/${id}`, {
            method: 'GET',
            requiresAuth: true,
        }),
    create: (data: CreateUserDto) =>
        apiRequest<UsersCreateResponse>('/users', {
            method: 'POST',
            data,
            requiresAuth: true,
        }),
    update: (id: number, data: UpdateUserDto) =>
        apiRequest<UsersUpdateResponse>(`/users/${id}`, {
            method: 'PATCH',
            data,
            requiresAuth: true,
        }),
    delete: (id: number) =>
        apiRequest<void>(`/users/${id}`, {
            method: 'DELETE',
            requiresAuth: true,
        }),
};

export const sections = {
    getAll: () =>
        apiRequest<SectionsListResponse>('/sections', {
            method: 'GET',
            requiresAuth: true,
        }),
    getOne: (id: number) =>
        apiRequest<SectionsOneResponse>(`/sections/${id}`, {
            method: 'GET',
            requiresAuth: true,
        }),
    create: (data: CreateSectionDto) =>
        apiRequest<SectionsCreateResponse>('/sections', {
            method: 'POST',
            data,
            requiresAuth: true,
        }),
    update: (id: number, data: UpdateSectionDto) =>
        apiRequest<SectionsUpdateResponse>(`/sections/${id}`, {
            method: 'PATCH',
            data,
            requiresAuth: true,
        }),
    delete: (id: number) =>
        apiRequest(`/sections/${id}`, {
            method: 'DELETE',
            requiresAuth: true,
        }),
};

type ProductParams = operations['ProductsController_findAll']['parameters']['query'];

export const products = {
    getAll: (params?: ProductParams) =>
        apiRequest<ProductsListResponse>('/products', {
            method: 'GET',
            query: params,
            requiresAuth: true,
        }),
    getOne: (id: number) =>
        apiRequest<ProductsOneResponse>(`/products/${id}`, {
            method: 'GET',
            requiresAuth: true,
        }),
    create: (data: CreateProductDto) =>
        apiRequest<ProductsCreateResponse>('/products', {
            method: 'POST',
            data,
            requiresAuth: true,
        }),
    update: (id: number, data: UpdateProductDto) =>
        apiRequest<ProductsUpdateResponse>(`/products/${id}`, {
            method: 'PATCH',
            data,
            requiresAuth: true,
        }),
    delete: (id: number) =>
        apiRequest(`/products/${id}`, {
            method: 'DELETE',
            requiresAuth: true,
        }),
};

export const warehouses = {
    getAll: () =>
        apiRequest<WarehousesListResponse>('/warehouses', {
            method: 'GET',
            requiresAuth: true,
        }),
    getOne: (id: number) =>
        apiRequest<WarehousesOneResponse>(`/warehouses/${id}`, {
            method: 'GET',
            requiresAuth: true,
        }),
    create: (data: CreateWarehouseDto) =>
        apiRequest<WarehousesCreateResponse>('/warehouses', {
            method: 'POST',
            data,
            requiresAuth: true,
        }),
    update: (id: number, data: UpdateWarehouseDto) =>
        apiRequest<WarehousesUpdateResponse>(`/warehouses/${id}`, {
            method: 'PATCH',
            data,
            requiresAuth: true,
        }),
    delete: (id: number) =>
        apiRequest(`/warehouses/${id}`, {
            method: 'DELETE',
            requiresAuth: true,
        }),
};

export const images = {
    upload: (formData: FormData) => {
        apiRequest<ImagesUploadResponse>('/images/upload', {
            method: 'POST',
            data: formData,
            requiresAuth: true,
        })
    },

    setAsMain: (id: string) =>
        apiRequest<ImagesSetMainResponse>(`/images/${id}/main`, {
            method: 'PATCH',
            requiresAuth: true,
        }),
    
    delete: (id: string) =>
        apiRequest(`/images/${id}`, {
            method: 'DELETE',
            requiresAuth: true,
        }),
};