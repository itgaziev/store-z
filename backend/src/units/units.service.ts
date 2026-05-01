import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
    constructor(
        @InjectRepository(Unit)
        private unitRepository: Repository<Unit>,
    ) { }

    async create(createUnitDto: CreateUnitDto): Promise<Unit> {
        const existingUnit = await this.unitRepository.findOne({
            where: { code: createUnitDto.code },
            withDeleted: true
        });

        if (existingUnit) throw new ConflictException('Unit with this code already exists');


        const unit = this.unitRepository.create({
            ...createUnitDto,
        });

        return this.unitRepository.save(unit);
    }

    async findAll(): Promise<Unit[]> {        
        return this.unitRepository.find();
    }

    async findOne(id: string): Promise<Unit> {
        const unit = await this.unitRepository.findOne({
            where: { id },
            withDeleted: true
        });

        if (!unit) throw new NotFoundException('Unit not found');

        return unit;
    }

    async update(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit> {
        const unit = await this.findOne(id);

        if (updateUnitDto.code && updateUnitDto.code !== unit.code) {
            const existingUnit = await this.unitRepository.findOne({
                where: { code: updateUnitDto.code },
                withDeleted: true
            });

            if (existingUnit && existingUnit.id !== id) {
                throw new ConflictException('Unit with this code already exists');
            }
        }

        Object.assign(unit, updateUnitDto);
        return this.unitRepository.save(unit);
    }

    async remove(id: string): Promise<void> {
        await this.unitRepository.softDelete(id);
    }

    async restore(id: string): Promise<void> {
        await this.unitRepository.restore(id);
    }
}
