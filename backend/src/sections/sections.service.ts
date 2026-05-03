import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Section } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
    constructor(
        @InjectRepository(Section)
        private sectionsRepository: TreeRepository<Section>,
    ) {}

    async create(createSectionDto: CreateSectionDto): Promise<Section> {
        const section = this.sectionsRepository.create(createSectionDto);

        if (createSectionDto.parentId) {
            const parent = await this.sectionsRepository.findOne({
                where: { id: createSectionDto.parentId },
                withDeleted: true
            });

            if (!parent) {
                throw new NotFoundException('Parent section not found');
            }

            section.parent = parent;
        }

        return this.sectionsRepository.save(section);
    }

    async findAll(): Promise<Section[]> {
        return this.sectionsRepository.findTrees()
    }

    async findOne(id: string): Promise<Section> {
        const section = await this.sectionsRepository.findOne({
            where: { id },
            withDeleted: true,
        });

        if (!section) {
            throw new NotFoundException('Section not found');
        }

        return section;
    }

    async update(id: string, updateSectionDto: UpdateSectionDto): Promise<Section> {
        const section = await this.findOne(id);

        if (updateSectionDto.parentId) {
            if (updateSectionDto.parentId === id) {
                throw new NotFoundException('Section cannot be its own parent');
            }

            const parent = await this.sectionsRepository.findOne({
                where: { id: updateSectionDto.parentId },
                withDeleted: true
            });

            if (!parent) {
                throw new NotFoundException('Parent section not found');
            }

            section.parent = parent
            delete updateSectionDto.parentId;
        }

        Object.assign(section, updateSectionDto);
        return this.sectionsRepository.save(section);
    }

    async remove(id: string): Promise<void> {
        // TODO: Move children to another section or set their parent to null before deleting
        // TODO: Handle products that belong to this section (move them to another section or set their section to null)
        const section = await this.findOne(id);
        await this.sectionsRepository.remove(section);

    }

    async restore(id: string): Promise<void> {
        await this.sectionsRepository.restore(id);
    }
}
