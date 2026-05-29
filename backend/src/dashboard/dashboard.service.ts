import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getDashboardStats() {
    const totalBooks =
      await this.prisma.book.count();

    const availableBooks =
      await this.prisma.book.aggregate({
        _sum: {
          availableCopies: true,
        },
      });

    const borrowedBooks =
      await this.prisma.borrow.count({
        where: {
          status: 'BORROWED',
        },
      });

    const overdueBooks =
      await this.prisma.borrow.count({
        where: {
          status: 'OVERDUE',
        },
      });

    const students =
      await this.prisma.user.count({
        where: {
          role: 'STUDENT',
        },
      });

    return {
      totalBooks,
      availableBooks:
        availableBooks._sum
          .availableCopies || 0,
      borrowedBooks,
      overdueBooks,
      students,
    };
  }
}