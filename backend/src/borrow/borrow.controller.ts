import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { Query } from '@nestjs/common';

import { BorrowService }
from './borrow.service';

import { JwtAuthGuard }
from '../auth/jwt-auth.guard';

import { RolesGuard }
from '../auth/roles.guard';

import { Roles }
from '../auth/roles.decorator';

@Controller('borrow')
export class BorrowController {
  constructor(
    private borrowService:
      BorrowService,
  ) {}

  @Post(
    ':userId/:bookId',
  )
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('STUDENT')
  borrowBook(
    @Param('userId')
    userId: string,

    @Param('bookId')
    bookId: string,
  ) {
    return this.borrowService.borrowBook(
      +userId,
      +bookId,
    );
  }

  @Get()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  getBorrowedBooks() {
    return this.borrowService.getBorrowedBooks();
  }

  @Get('history')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  getHistory(
  @Query('page')
  page: string,

  @Query('limit')
  limit: string,

  @Query('student')
  student: string,

  @Query('status')
  status: string,
  ) {
    return this.borrowService.getHistory(
      Number(page) || 1,
      Number(limit) || 10,
      student,
      status,
    );
  }

  @Get('my/:userId')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('STUDENT')
  getMyBooks(
    @Param('userId')
    userId: string,
  ) {
    return this.borrowService.getMyBooks(
      +userId,
    );
  }

  @Patch(
    'return/:id',
  )
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('STUDENT')
  returnBook(
    @Param('id')
    id: string,
  ) {
    return this.borrowService.returnBook(
      +id,
    );
  }
}