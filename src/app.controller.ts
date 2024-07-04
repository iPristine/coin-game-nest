import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/user/:id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    return await this.userService.user({ id: Number(id) });
  }

  @Get('/users')
  async getUsers(): Promise<User[]> {
    return await this.userService.users({});
  }
}
