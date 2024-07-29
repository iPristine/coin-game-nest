import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Response } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TelegramAuthQuery } from '../user/dto/telegram-auth-query.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('telegram')
  @ApiQuery({
    name: 'query',
    type: TelegramAuthQuery,
    description: 'Telegram authentication query parameters',
    required: true,
  })
  async telegramAuth(@Query() query: TelegramAuthQuery) {

    const { hash, ...data } = query;
    const token = process.env.TG_BOT_TOKEN;

    const checkString = Object.keys(data || {})
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('\n');
    const secretKey = crypto.createHash('sha256').update(token).digest();
    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex');

    if (computedHash !== hash) {
      throw new Error('Invalid data received from Telegram');
    }

    const tgUser = {...data, id: +data.id}

    const user = await this.userService.findOrCreateUser(tgUser);

    const jwtToken = this.authService.generateToken(user);

    return { message: 'Authenticated', token: jwtToken };
  }

  @Get('telegram/callback')
  handleTelegramCallback(@Query() query, @Res() res: Response) {
    if (this.validateTelegramAuth(query)) {
      // Аутентификация прошла успешно
      res.redirect('/success');
    } else {
      // Ошибка аутентификации
      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    }
  }

  private validateTelegramAuth(query: any): boolean {
    const token = process.env.TG_BOT_TOKEN;
    const { hash, ...userData } = query;
    const dataCheckString = Object.keys(userData)
      .sort()
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    const secretKey = crypto.createHash('sha256').update(token).digest();
    const checkHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return checkHash === hash;
  }
}
