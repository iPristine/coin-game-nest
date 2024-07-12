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

@Controller('auth')
export class AuthController {
  @Get('telegram/callback')
  handleTelegramCallback(@Query() query, @Res() res: Response) {
    if (this.validateTelegramAuth(query)) {
      // Аутентификация прошла успешно
      console.log('Authenticated user:', query);
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
