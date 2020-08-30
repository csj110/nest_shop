import { Controller, Post, Body, Get, Query, BadRequestException, Param } from '@nestjs/common';
import { CateDto } from 'src/dto/category.dto';
import { CategoryService } from './category.service';
import { CategoryEntity } from 'src/entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private cateService: CategoryService) {
  }

  @Post()
  async create(@Body() cate: CateDto): Promise<any> {
    return await this.cateService.createCate(cate)
  }

  @Get("/:id")
  async findOneById(@Param("id") id: number): Promise<CategoryEntity> {
    if (!id || !id.toFixed) throw new BadRequestException("id should provided")
    return await this.cateService.findById(id)
  }
}
