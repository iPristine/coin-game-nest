import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/jwt.payload';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const userId = req.user.id;
    const user = await this.userService.findUserById(userId);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const userPayload = req.user as JwtPayload;

    console.log('REQ:', userPayload.id);
    const userId = userPayload.id;
    const user = await this.userService.findUserById(userId);
    return user;
  }
}
