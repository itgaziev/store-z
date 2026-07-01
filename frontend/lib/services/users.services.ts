import { axiosWithAuth } from "../api/interceptors";
import { IPaginatedResponse } from "../types/paginates.types";
import { ICreateUserDto, IRole, IUserResponse, IUserTableRow } from "../types/users.types";
import { IFindByBodyRequest } from "../types/table.types";
import { formatUtcDateDirectly } from "../utils";

class UserService {
    private BASE_URL = '/users';

    /**
     * Запрашивает список пользователей через POST /users/list.
     * Тело запроса соответствует FindUsersBodyDto на бэкенде.
     * Возвращает трансформированные строки таблицы IUserTableRow[].
     */
    async findAllByBody(body: IFindByBodyRequest): Promise<IPaginatedResponse<IUserTableRow>> {
        const response = await axiosWithAuth.post<IPaginatedResponse<IUserResponse>>(
            `${this.BASE_URL}/list`,
            body,
        );

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
            roleName: user.role.name,
        }));

        return {
            data: transformedData,
            meta: response.data.meta,
        };
    }

    /**
     * Создаёт нового пользователя через POST /users.
     */
    async create(dto: ICreateUserDto): Promise<IUserResponse> {
        const response = await axiosWithAuth.post<IUserResponse>(this.BASE_URL, dto);
        return response.data;
    }

    /**
     * Подгружает список ролей с пагинацией и поиском (GET /users/roles).
     * Используется в FilterModal на странице создания пользователя.
     */
    async getRoles(page: number = 1, limit: number = 20, searchTerm?: string): Promise<IPaginatedResponse<IRole>> {
        const params: Record<string, string | number> = { page, limit };
        if (searchTerm?.trim()) params.searchTerm = searchTerm.trim();
        const response = await axiosWithAuth.get<IPaginatedResponse<IRole>>(`${this.BASE_URL}/roles`, { params });
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
