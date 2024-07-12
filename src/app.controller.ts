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

  @Get('/users')
  async getUsers(): Promise<User[]> {
    return await this.userService.users({});
  }

  @Get('/user')
  async getUser(): Promise<User | null> {
    const id = 1;
    return await this.userService.user({ id: id });
  }

  @Get('/game/info')
  async getGameInfo(): Promise<any> {
    return null;
  }

  @Get('/game/spin')
  async spinGame(): Promise<any> {
    return null;
  }

  /*
  Tasks
  get all tasks list
  apply task

  tasks could have different types:
  - daily
  - weekly
  - one-time
  - etc.

  tasks could have different statuses:
  - new
  - applying
  - done
   */

  @Get('/tasks/')
  async getTasks(): Promise<any> {
    return null;
  }

  /*
  Upgrades

  get all upgrades list
  buy upgrade

   */

  @Get('/upgrades')
  async getUpgrades(): Promise<any> {
    return null;
  }

  @Get('/upgrades/:id')
  async getUpgrade(@Param('id') id: string): Promise<any> {
    return null;
  }
}
