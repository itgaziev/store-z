import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currencies } from './entities/currencies.entity';
import { Repository } from 'typeorm';
import { CreateCurrenciesDto } from './dto/create-currencies.dto';
import { UpdateCurrenciesDto } from './dto/update-currencies.dto';

@Injectable()
export class CurrenciesService {
    constructor(
        @InjectRepository(Currencies)
        private currenciesRepository: Repository<Currencies>
    ) {}

    async create(createCurrenciesDto: CreateCurrenciesDto): Promise<Currencies> {
        const existingCurrencies = await this.currenciesRepository.findOne({
            where: { code: createCurrenciesDto.code },
            withDeleted: true
        });

        if (existingCurrencies) throw new ConflictException('Currencies with this code already exists');

        const currencies = await this.currenciesRepository.create(createCurrenciesDto);

        return this.currenciesRepository.save(currencies);
    }

    async findAll(): Promise<Currencies[]> {
        return this.currenciesRepository.find({ withDeleted: true });
    }

    async findOne(id: string): Promise<Currencies> {
        const currencies = await this.currenciesRepository.findOne({
            where: { id },
            withDeleted: true
        });

        if (!currencies) throw new NotFoundException('Currencies not found');

        return currencies;
    }

    async update(id: string, updateCurrenciesDto: UpdateCurrenciesDto): Promise<Currencies> {
        const currencies = await this.findOne(id);

        if (updateCurrenciesDto.code && updateCurrenciesDto.code !== currencies.code) {
            const existingCurrencies = await this.currenciesRepository.findOne({
                where: { code : updateCurrenciesDto.code },
                withDeleted: true,
            });

            if (existingCurrencies && existingCurrencies.id !== id) {
                throw new ConflictException('Currencies with this code already exists');
            }
        }

        Object.assign(currencies, updateCurrenciesDto);

        return this.currenciesRepository.save(currencies);
    }

    async remove(id: string): Promise<void> {
        const currencies = await this.findOne(id);
        await this.currenciesRepository.remove(currencies);
    }
}
