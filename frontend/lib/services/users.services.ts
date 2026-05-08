import { axiosWithAuth } from "../api/interceptors";
import { IPaginatedResponse } from "../types/paginates.types";
import { IUser, IUserResponse } from "../types/users.types";

class UserService {
    private BASE_URL = '/users';

    async getAll(page: number = 1, limit: number = 10, sortBy: string = 'createdAt', order: 'ASC' | 'DESC' = 'DESC', searchTerm: string = ''): Promise<IPaginatedResponse<IUserResponse>> {
        const endpoint = `${this.BASE_URL}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&searchTerm=${searchTerm}`;
        const response = await axiosWithAuth.get<IPaginatedResponse<IUserResponse>>(endpoint);
        return response.data;
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