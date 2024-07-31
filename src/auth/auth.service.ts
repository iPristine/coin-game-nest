import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './jwt.payload';
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";


@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET_KEY;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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