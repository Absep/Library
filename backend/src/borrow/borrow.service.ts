import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()
export class BorrowService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async borrowBook(
    userId: number,
    bookId: number,
  ) {
    const book =
      await this.prisma.book.findUnique({
        where: {
          id: bookId,
        },
      });

    if (!book) {
      throw new NotFoundException(
        'Book not found',
      );
    }

    if (
      book.availableCopies <= 0
    ) {
      throw new BadRequestException(
        'No copies available',
      );
    }

    // Prevent duplicate borrowing
    const alreadyBorrowed =
      await this.prisma.borrow.findFirst({
        where: {
          userId,
          bookId,

          status: {
            in: [
              'BORROWED',
              'OVERDUE',
            ],
          },
        },
      });

    if (
      alreadyBorrowed
    ) {
      throw new BadRequestException(
        'You already borrowed this book',
      );
    }

    const dueDate =
      new Date();

    dueDate.setDate(
      dueDate.getDate() + 7,
    );

    const borrowCount =
      await this.prisma.borrow.count({
        where: {
          bookId,
        },
      });

    const copyNumber =
      `${book.title
        .substring(0, 2)
        .toUpperCase()}-${String(
          borrowCount + 1,
        ).padStart(3, '0')}`;    

    const borrow =
      await this.prisma.borrow.create({
        data: {
          userId,
          bookId,
          dueDate,
          copyNumber,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },

          book: true,
        },
      });

    await this.prisma.book.update({
      where: {
        id: bookId,
      },

      data: {
        availableCopies:
          book.availableCopies -
          1,
      },
    });

    return borrow;
  }

    async getBorrowedBooks() {
    const borrows =
      await this.prisma.borrow.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },

          book: true,
        },

        orderBy: {
          borrowDate: 'desc',
        },
      });

    const today =
      new Date();

    for (const borrow of borrows) {
      const dueDate =
        new Date(
          borrow.dueDate,
        );

      if (
        borrow.status !==
          'RETURNED' &&
        dueDate < today
      ) {
        await this.prisma.borrow.update({
          where: {
            id: borrow.id,
          },

          data: {
            status:
              'OVERDUE',
          },
        });

        borrow.status =
          'OVERDUE';
      }
    }

    return borrows.map(
      (borrow) => {
        let fine = 0;

        const dueDate =
          new Date(
            borrow.dueDate,
          );

        if (
          borrow.status ===
          'OVERDUE'
        ) {
          const daysLate =
            Math.ceil(
              (
                today.getTime() -
                dueDate.getTime()
              ) /
                (
                  1000 *
                  60 *
                  60 *
                  24
                ),
            );

          fine =
            daysLate * 10;
        }

        return {
          ...borrow,
          fine,
        };
      },
    );
  }

  async getMyBooks(
    userId: number,
  ) {
    const borrows =
      await this.prisma.borrow.findMany({
        where: {
          userId,

          OR: [
            {
              status:
                'BORROWED',
            },
            {
              status:
                'OVERDUE',
            },
          ],
        },

        include: {
          book: true,
        },

        orderBy: {
          borrowDate:
            'desc',
        },
      });

    const today =
      new Date();

    return borrows.map(
      (borrow) => {
        const dueDate =
          new Date(
            borrow.dueDate,
          );

        let fine = 0;

        if (
          dueDate <
          today
        ) {
          borrow.status =
            'OVERDUE';

          const diffTime =
            today.getTime() -
            dueDate.getTime();

          const overdueDays =
            Math.ceil(
              diffTime /
                (1000 *
                  60 *
                  60 *
                  24),
            );

          fine =
            overdueDays *
            10;
        }

        return {
          ...borrow,
          fine,
        };
      },
    );
  }

  async returnBook(
    borrowId: number,
  ) {
    const borrow =
      await this.prisma.borrow.findUnique({
        where: {
          id: borrowId,
        },

        include: {
          book: true,
        },
      });

    if (!borrow) {
      throw new NotFoundException(
        'Borrow record not found',
      );
    }

    const updatedBorrow =
      await this.prisma.borrow.update({
        where: {
          id: borrowId,
        },

        data: {
          status:
            'RETURNED',

          returnDate:
            new Date(),
        },
      });

    await this.prisma.book.update({
      where: {
        id: borrow.bookId,
      },

      data: {
        availableCopies:
          borrow.book
            .availableCopies +
          1,
      },
    });

    return updatedBorrow;
  }
}