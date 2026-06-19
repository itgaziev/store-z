import { axiosWithAuth } from "../api/interceptors";
import { IPaginatedResponse } from "../types/paginates.types";
import { IUser, IUserResponse, IUserTableRow } from "../types/users.types";
import { formatDate, formatUtcDateDirectly } from "../utils";

class UserService {
    private BASE_URL = '/users';

    async getAll(page: number = 1, limit: number = 10, sortBy: string = 'createdAt', order: 'ASC' | 'DESC' = 'DESC', searchTerm: string = ''): Promise<IPaginatedResponse<IUserResponse>> {
        const endpoint = `${this.BASE_URL}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&searchTerm=${searchTerm}`;
        const response = await axiosWithAuth.get<IPaginatedResponse<IUserResponse>>(endpoint);
        return response.data;
    }

    async getAllRow(page: number = 1, limit: number = 10, sortBy: string = 'createdAt', order: 'ASC' | 'DESC' = 'DESC', searchTerm: string = ''): Promise<IPaginatedResponse<IUserTableRow>> {
        const endpoint = `${this.BASE_URL}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&searchTerm=${searchTerm}`;
        const response = await axiosWithAuth.get<IPaginatedResponse<IUserResponse>>(endpoint);
        const transformedData: IUserTableRow[] = response.data.data.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            patronymic: user.patronymic,
            isActive: user.isActive ? 'Да' : 'Нет',
            createdAt: formatUtcDateDirectly(user.createdAt),
            updatedAt: formatUtcDateDirectly(user.updatedAt),
            deletedAt: formatUtcDateDirectly(user.deletedAt),
            roleName: user.role.name
        }));

        return {
            ...response.data,
            data: transformedData
        };
    }

    async getById(id: string) {

    }

    async me() {
        const endpoint = this.BASE_URL + '/me';
        const response = await axiosWithAuth.get<IUserResponse>(endpoint);

        return response.data;
    }

    async update(id: string) {

    }

    async remove(id: string) {

    }
}

export const userService = new UserService();