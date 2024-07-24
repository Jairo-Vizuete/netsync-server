// src/auth/auth.controller.ts
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from 'src/users/users.service';
// import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Body() { email }: { email: string }) {
    return this.usersService.findOne(email);
  }

  @Get('greetings')
  greetings() {
    return 'Hello bro!';
  }

  @Post('register')
  async register(@Body() body) {
    const { email, password } = body;
    return this.authService.register(email, password);
  }
}
