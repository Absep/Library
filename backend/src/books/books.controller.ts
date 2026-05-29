import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.booksService.create(body);
  }

  @Get()
  findAll(
    @Query() query: any,
  ) {
    return this.booksService.findAll(
      query,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.booksService.update(
      +id,
      body,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}