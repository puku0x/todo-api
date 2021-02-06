import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Query,
  Param,
  Body,
} from '@nestjs/common';

import { TodoCreateDto, TodoUpdateDto } from './models';
import { TodoService } from './services';

@Controller('todos')
export class AppController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() todo: TodoCreateDto) {
    return await this.todoService.create(todo);
  }

  @Get()
  async findAll(@Query('offset') offset = '0', @Query('limit') limit = '10') {
    return await this.todoService.findAll(+offset, +limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.todoService.findOne(id);
  }

  @Put(':id')
  async uodate(@Param('id') id: string, @Body() todo: TodoUpdateDto) {
    return await this.todoService.update(id, todo);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.todoService.remove(id);
  }
}
