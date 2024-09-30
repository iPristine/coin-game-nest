import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './jwt.payload';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { parse, validate } from '@telegram-apps/init-data-node';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET_KEY;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(initData: string) {
    const token = process.env.TG_BOT_TOKEN;
    try {
      validate(initData, token, {
        expiresIn: 300,
      });
      const parsedData = parse(initData);
      const user = await this.userService.findOrCreateUser(
        parsedData.user as any,
      );

      const payload = { id: user.id };

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
    return this.userService.findUserById(payload.id);
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.jwtSecret);
  }
}
