import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

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

    const { password, ...safeUser } = user;

    return {
      message: 'User registered successfully',
      user: safeUser,
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

    const { password, ...safeUser } = user;

    return {
      access_token: token,
      user: safeUser,
    };
  }

  async googleLogin(
    googleUser: any,
  ) {
    let user =
      await this.usersService.findByEmail(
        googleUser.email,
      );

    if (!user) {
      const randomPassword =
        crypto.randomUUID();

      user =
        await this.usersService.createUser({
          name: googleUser.name,
          email: googleUser.email,
          password: await bcrypt.hash(
            randomPassword,
            10,
          ),
          role: 'STUDENT',
        });
    }

    const token =
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

    const { password, ...safeUser } = user;

    return {
      access_token: token,
      user: safeUser,
    };
  }
}