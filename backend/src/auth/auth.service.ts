import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(body: any) {
    const existingUser =
      await this.usersService.findByEmail(body.email);

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(body.password, 10);

    const user =
      await this.usersService.createUser({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role || 'STUDENT',
      });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(body: any) {
    const user =
      await this.usersService.findByEmail(body.email);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const passwordMatch =
      await bcrypt.compare(
        body.password,
        user.password,
      );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const token =
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

    return {
      access_token: token,
      user,
    };
  }
}