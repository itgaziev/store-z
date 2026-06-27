import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { DateFilterDto, StringFilterDto, UserFilters } from './dto/filter-value.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(Role)
        private rolesRepository: Repository<Role>
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
            withDeleted: true,
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const role = createUserDto.roleId
            ? await this.rolesRepository.findOne({ where: { id: createUserDto.roleId } })
            : await this.rolesRepository.findOne({ where: { code: 'USER' } });

        if (!role) {
            throw new BadRequestException('Role not found')
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
            role
        });

        return this.usersRepository.save(user);
    }

    async findAll(
        query: FindUsersQueryDto,
    ): Promise<{ data: User[]; meta: { total: number; page: number; limit: number; pageCount: number } }> {
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC', filters, searchTerm } = query;

        // --- Parse filters ---
        let parsedFilters: UserFilters = {};
        if (filters) {
            try {
                parsedFilters = JSON.parse(filters) as UserFilters;
            } catch {
                throw new BadRequestException('Invalid JSON in filters parameter');
            }
        }

        // --- Build query ---
        const qb = this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .withDeleted()
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy(`user.${sortBy}`, order);

        // --- Global search (OR across multiple fields) ---
        if (searchTerm) {
            qb.andWhere(
                '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
                { search: `%${searchTerm}%` },
            );
        }

        // --- Apply string filters ---
        const STRING_FIELDS = ['firstName', 'lastName', 'email', 'patronymic'] as const;
        for (const field of STRING_FIELDS) {
            const filter = parsedFilters[field] as StringFilterDto | undefined;
            if (!filter?.operator || filter.value === undefined) continue;

            const param = `${field}Val`;
            switch (filter.operator) {
                case 'equal':
                    qb.andWhere(`user.${field} = :${param}`, { [param]: filter.value });
                    break;
                case 'not-equal':
                    qb.andWhere(`user.${field} != :${param}`, { [param]: filter.value });
                    break;
                case 'contain':
                    qb.andWhere(`user.${field} ILIKE :${param}`, { [param]: `%${filter.value}%` });
                    break;
                case 'not-contain':
                    qb.andWhere(`user.${field} NOT ILIKE :${param}`, { [param]: `%${filter.value}%` });
                    break;
            }
        }

        // --- Apply date filter ---
        if (parsedFilters.createdAt) {
            const dateFilter = parsedFilters.createdAt as DateFilterDto;
            switch (dateFilter.operator) {
                case 'less':
                    qb.andWhere('user.createdAt <= :createdAtVal', { createdAtVal: dateFilter.value });
                    break;
                case 'more':
                    qb.andWhere('user.createdAt >= :createdAtVal', { createdAtVal: dateFilter.value });
                    break;
                case 'between':
                    if (!dateFilter.valueTo) {
                        throw new BadRequestException('valueTo is required for "between" operator on createdAt');
                    }
                    qb.andWhere('user.createdAt BETWEEN :createdAtFrom AND :createdAtTo', {
                        createdAtFrom: dateFilter.value,
                        createdAtTo: dateFilter.valueTo,
                    });
                    break;
            }
        }

        // --- Apply roleId filter ---
        if (parsedFilters.roleId) {
            qb.andWhere('role.id = :roleId', { roleId: parsedFilters.roleId });
        }

        const [data, total] = await qb.getManyAndCount();
        const pageCount = Math.ceil(total / limit);

        return { data, meta: { total, page, limit, pageCount } };
    }

    async getRoles(
        page: number = 1,
        limit: number = 10,
        sortBy: string = 'createdAt',
        order: 'ASC' | 'DESC' = 'DESC',
        searchTerm: string = '',
    ): Promise<{ data: Role[]; total: number; page: number; limit: number }> {
        const [data, total] = await this.rolesRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            withDeleted: true,
            order: {
                [sortBy]: order
            },
            where: searchTerm
                ? [
                    { name: ILike(`%${searchTerm}%`) }
                ]
                : {}
        });

        return { data, total, page, limit }
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['role'],
            withDeleted: true,
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['role'],
            withDeleted: true
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        if (updateUserDto.roleId) {
            const role = await this.rolesRepository.findOne({ where: { id: updateUserDto.roleId } });

            if (!role) {
                throw new BadRequestException('Role not found');
            }

            user.role = role;
            delete updateUserDto.roleId;
        }

        Object.assign(user, updateUserDto);

        return this.usersRepository.save(user)
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }

    async restore(id: string): Promise<void> {
        await this.usersRepository.restore(id);
    }
}
