import { axiosWithAuth } from "../api/interceptors";
import { IUser, IUserResponse } from "../types/users.types";

class UserService {
    private BASE_URL = '/users';

    async getAll(page: number = 1, limit: number = 10) {

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