import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Query,
  Param,
  Body
} from '@nestjs/common';

import { Todo } from './todo.model';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() todo: Partial<Todo>) {
    return await this.todoService.create(todo);
  }

  @Get()
  async findAll(@Query() query: { offset: number; limit: number }) {
    const { offset, limit } = query;
    return await this.todoService.findAll(offset, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.todoService.findOne(id);
  }

  @Put(':id')
  async uodate(@Param('id') id: string, @Body() todo: Todo) {
    return await this.todoService.update(id, todo);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.todoService.remove(id);
  }
}
