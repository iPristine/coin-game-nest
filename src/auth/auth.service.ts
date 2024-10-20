import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './jwt.payload';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { parse, validate } from '@telegram-apps/init-data-node';
import { TgUserEntity } from './tg-user.entity';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET_KEY;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(initData: string) {
    // Commented out because we don't need to check the hash in the DEV backend
    // const token = process.env.TG_BOT_TOKEN;
    try {
      // validate(initData, token, {
      //   expiresIn: 300,
      // });
      const parsedData = parse(initData);
      const user = await this.userService.findOrCreateUser(parsedData.user);

      const payload: JwtPayload = {
        id: user.id,
        username: user.username,
        telegramId: parsedData.user.id,
      };

      return {
        user,
        token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  generateToken(user: any) {
    const payload = { id: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  async validateUserByJwtPayload(payload: JwtPayload) {
    console.log('VALIDATE:', payload);
    return this.userService.findUserById(payload.id);
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.jwtSecret);
  }
}
