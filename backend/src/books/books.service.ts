import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    data: any,
  ) {
    return this.prisma.book.create({
      data,
    });
  }

  async findAll(
    query: any,
  ) {
    const page =
      parseInt(
        query.page,
      ) || 1;

    const limit =
      parseInt(
        query.limit,
      ) || 10;

    const search =
      query.search ||
      '';

    const category =
      query.category ||
      '';

    const sortBy =
      query.sortBy ||
      'title';

    const order =
      query.order ||
      'asc';

    const skip =
      (page - 1) *
      limit;

    const where: any =
      {};

    // Search
    // Search
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },

        {
          author: {
            contains: search,
            mode: 'insensitive',
          },
        },

        {
          category: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Category filter
    if (category) {
      where.category =
        category;
    }

    const books =
      await this.prisma.book.findMany({
        where,

        skip,

        take:
          limit,

        orderBy: {
          [sortBy]:
            order,
        },
      });

    const total =
      await this.prisma.book.count({
        where,
      });

    return {
      data: books,
      total,
      page,
      totalPages:
        Math.ceil(
          total /
            limit,
        ),
    };
  }

  async findOne(
    id: number,
  ) {
    const book =
      await this.prisma.book.findUnique({
        where: {
          id,
        },
      });

    if (!book) {
      throw new NotFoundException(
        'Book not found',
      );
    }

    return book;
  }

  async update(
    id: number,
    data: any,
  ) {
    await this.findOne(
      id,
    );

    return this.prisma.book.update({
      where: {
        id,
      },

      data,
    });
  }

  async remove(
    id: number,
  ) {
    await this.findOne(
      id,
    );

    return this.prisma.book.delete({
      where: {
        id,
      },
    });
  }
}