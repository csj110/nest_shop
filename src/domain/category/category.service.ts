import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { CateDto } from 'src/dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private cateRepo: Repository<CategoryEntity>
  ) { }

  async createCate(cateDto: CateDto): Promise<any> {
    const cate = await this.cateRepo.create(cateDto)
    await cate.save()
    return cate
  }

  async findById(id: number): Promise<CategoryEntity> {
    const cate = await this.cateRepo.findOne({ select: ["name", "id"], where: { id } })
    if (!cate) throw new NotFoundException
    return cate
  }
}
