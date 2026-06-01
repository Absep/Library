import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BooksService } from './books.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
  ) {}

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  create(
    @Body() body: any,
  ) {
    return this.booksService.create(
      body,
    );
  }

  @Get()
  @UseGuards(
    JwtAuthGuard,
  )
  findAll(
    @Query() query: any,
  ) {
    return this.booksService.findAll(
      query,
    );
  }

  @Get(':id')
  @UseGuards(
    JwtAuthGuard,
  )
  findOne(
    @Param('id') id: string,
  ) {
    return this.booksService.findOne(
      +id,
    );
  }

  @Patch(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
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
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  remove(
    @Param('id') id: string,
  ) {
    return this.booksService.remove(
      +id,
    );
  }
}