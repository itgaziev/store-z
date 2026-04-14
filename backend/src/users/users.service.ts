import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(Role)
        private rolesRepository: Repository<Role>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
            withDeleted: true,
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const role = createUserDto.roleId
            ? await this.rolesRepository.findOne({ where: { id: createUserDto.roleId }})
            : await this.rolesRepository.findOne({ where: { name: 'USER' }});

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

    async findAll(page: number = 1, limit: number = 10): Promise<{ data: User[]; total: number; page: number; limit: number}> {
        const [data, total] = await this.usersRepository.findAndCount({
            relations: ['role'],
            skip: (page - 1) * limit,
            take: limit,
            withDeleted: true,
        });

        return { data, total, page, limit }
    }

    async findOne(id: number): Promise<User> {
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

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        if (updateUserDto.roleId) {
            const role = await this.rolesRepository.findOne({ where: { id: updateUserDto.roleId }});

            if (!role) {
                throw new BadRequestException('Role not found');
            }

            user.role = role;
            delete updateUserDto.roleId;
        }

        Object.assign(user, updateUserDto);

        return this.usersRepository.save(user)
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.softDelete(id);
    }

    async restore(id: number): Promise<void> {
        await this.usersRepository.restore(id);
    }
}
