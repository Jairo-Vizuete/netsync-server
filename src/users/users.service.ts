// src/users/users.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async findOne(email: string): Promise<User | null> {
    const user = await this.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.user.findUnique({
      where: { id },
    });
  }
}
