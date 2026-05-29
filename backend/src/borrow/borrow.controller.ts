import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
} from '@nestjs/common';

import { BorrowService } from './borrow.service';

@Controller('borrow')
export class BorrowController {
  constructor(
    private borrowService: BorrowService,
  ) {}

  @Post(':userId/:bookId')
  borrowBook(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.borrowService.borrowBook(
      +userId,
      +bookId,
    );
  }

  @Get()
  getBorrowedBooks() {
    return this.borrowService.getBorrowedBooks();
  }

  @Patch('return/:id')
returnBook(
  @Param('id') id: string,
) {
  return this.borrowService.returnBook(
    +id,
  );
}
}