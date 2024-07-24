import { Body, Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findOne(@Body() { email }: { email: string }) {
    return this.usersService.findOne(email);
  }
}
