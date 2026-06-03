import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req,
    @Res() res,
  ) {
    const result =
      await this.authService.googleLogin(
        req.user,
      );

    const encodedUser =
      encodeURIComponent(
        JSON.stringify(result.user),
      );

    res.redirect(
      `http://localhost:5173/oauth-success?token=${result.access_token}&role=${result.user.role}&user=${encodedUser}`,
    );
  }
}