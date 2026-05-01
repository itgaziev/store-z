import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tax } from './entities/tax.entity';
import { Repository } from 'typeorm';
import { CreateTaxDto } from './dto/create-taxes.dto';
import { UpdateTaxDto } from './dto/update-taxes.dto';

@Injectable()
export class TaxesService {
    constructor(
        @InjectRepository(Tax)
        private taxesRepository: Repository<Tax>
    ) {}

    async create(createTaxesDto: CreateTaxDto): Promise<Tax> {
        return this.taxesRepository.save(createTaxesDto);
    }

    async update(id: string, updateTaxesDto: UpdateTaxDto): Promise<Tax> {
        const taxes = await this.findOne(id);
        
        Object.assign(taxes, updateTaxesDto);
        return this.taxesRepository.save(taxes);
    }

    async findAll(): Promise<Tax[]> {
        return this.taxesRepository.find();
    }

    async findOne(id: string): Promise<Tax> {
        const taxes = await this.taxesRepository.findOne({
            where: { id },
            withDeleted: true
        });

        if (!taxes) throw new NotFoundException('Tax not found');

        return taxes;
    }

    async remove(id: string): Promise<void> {
        await this.taxesRepository.softDelete(id);
    }

    async restore(id: string): Promise<void> {
        await this.taxesRepository.restore(id);
    }
}
