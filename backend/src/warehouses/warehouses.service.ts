import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
    constructor(
        @InjectRepository(Warehouse)
        private warehousesRepository: Repository<Warehouse>,
    ) {}

    async create(createWarehouseDto: CreateWarehouseDto) : Promise<Warehouse> {
        const existingWarehouse = await this.warehousesRepository.findOne({
            where: { code: createWarehouseDto.code },
            withDeleted: true,
        });

        if (existingWarehouse) {
            throw new ConflictException('Warehouse with this code already exists');
        }

        const warehouse = this.warehousesRepository.create(createWarehouseDto);

        return this.warehousesRepository.save(warehouse);
    }

    async findAll(paginationDto: PaginationDto): Promise<{ data: Warehouse[]; total: number; page: number; limit: number}> {
        const [data, total] = await this.warehousesRepository.findAndCount({
            skip: (paginationDto.page! - 1) * paginationDto.limit!,
            take: paginationDto.limit!,
            withDeleted: true,
        });

        return { data, total, page: paginationDto.page!, limit: paginationDto.limit! }
    }

    async findOne(id: string): Promise<Warehouse> {
        const warehouse = await this.warehousesRepository.findOne({
            where: { id },
            withDeleted: true,
        });

        if (!warehouse) {
            throw new NotFoundException('Warehouses not found');
        }

        return warehouse;
    }

    async update(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
        const warehouse = await this.findOne(id);

        if (updateWarehouseDto.code && updateWarehouseDto.code !== warehouse.code) {
            const existingWarehouse = await this.warehousesRepository.findOne({
                where: { code: updateWarehouseDto.code },
                withDeleted: true
            });

            if (existingWarehouse && existingWarehouse.id !== id) {
                throw new ConflictException('Warehouse with this code already exists');
            }
        }

        Object.assign(warehouse, updateWarehouseDto);
        return this.warehousesRepository.save(warehouse);
    }

    async remove(id: string): Promise<void> {
        const warehouse = await this.findOne(id);
        await this.warehousesRepository.softDelete(id);
    }

    async restore(id: string): Promise<void> {
        await this.warehousesRepository.restore(id);
    }
}
