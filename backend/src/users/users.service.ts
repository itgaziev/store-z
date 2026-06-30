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
import { FindUsersBodyDto } from './dto/find-users-body.dto';

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

    async findAllByBody(
        body: FindUsersBodyDto,
    ): Promise<{ data: User[]; meta: { total: number; page: number; limit: number; pageCount: number } }> {
        const {
            page = 1,
            limit = 10,
            sort = 'createdAt',
            sortType = 'DESC',
            searchTerm,
            filters = [],
        } = body;

        const qb = this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .withDeleted()
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy(`user.${sort}`, sortType);

        // --- Global search (OR across firstName, lastName, email) ---
        if (searchTerm?.trim()) {
            qb.andWhere(
                '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
                { search: `%${searchTerm.trim()}%` },
            );
        }

        // --- Apply per-field filters (AND logic) ---
        for (const filter of filters) {
            const { key, operator, value } = filter;
            const paramKey = `${key}_${operator}_${Math.random().toString(36).slice(2, 7)}`;

            switch (key) {
                // ── String fields ──────────────────────────────────────────────
                case 'firstName':
                case 'lastName':
                case 'email':
                case 'patronymic': {
                    switch (operator) {
                        case 'equal':
                            qb.andWhere(`user.${key} = :${paramKey}`, { [paramKey]: value });
                            break;
                        case 'not-equal':
                            qb.andWhere(`user.${key} != :${paramKey}`, { [paramKey]: value });
                            break;
                        case 'contain':
                            qb.andWhere(`user.${key} ILIKE :${paramKey}`, { [paramKey]: `%${value}%` });
                            break;
                        case 'not-contain':
                            qb.andWhere(`user.${key} NOT ILIKE :${paramKey}`, { [paramKey]: `%${value}%` });
                            break;
                        default:
                            throw new BadRequestException(
                                `Operator "${operator}" is not supported for field "${key}"`,
                            );
                    }
                    break;
                }

                // ── Role ID (UUID equality) ─────────────────────────────────
                case 'roleId': {
                    switch (operator) {
                        case 'equal':
                            qb.andWhere('role.id = :roleId', { roleId: value });
                            break;
                        case 'not-equal':
                            qb.andWhere('role.id != :roleId', { roleId: value });
                            break;
                        default:
                            throw new BadRequestException(
                                `Operator "${operator}" is not supported for field "roleId". Use "equal" or "not-equal"`,
                            );
                    }
                    break;
                }

                // ── createdAt (date range) ──────────────────────────────────
                case 'createdAt': {
                    switch (operator) {
                        case 'less':
                            qb.andWhere('user.createdAt <= :createdAtVal', { createdAtVal: value });
                            break;
                        case 'more':
                            qb.andWhere('user.createdAt >= :createdAtVal', { createdAtVal: value });
                            break;
                        case 'between': {
                            const parts = value.split('|');
                            if (parts.length !== 2 || !parts[0] || !parts[1]) {
                                throw new BadRequestException(
                                    'For "between" operator on "createdAt", provide two dates separated by "|" (e.g. "2026-01-01|2026-06-28")',
                                );
                            }
                            qb.andWhere('user.createdAt BETWEEN :createdAtFrom AND :createdAtTo', {
                                createdAtFrom: parts[0].trim(),
                                createdAtTo: parts[1].trim(),
                            });
                            break;
                        }
                        default:
                            throw new BadRequestException(
                                `Operator "${operator}" is not supported for field "createdAt". Use "less", "more", or "between"`,
                            );
                    }
                    break;
                }

                default:
                    throw new BadRequestException(`Unknown filter key: "${key}"`);
            }
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
