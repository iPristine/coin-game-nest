import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import * as crypto from 'crypto';
import { ApiQuery, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['initData'],
      properties: {
        initData: { type: 'string' },
      },
    },
  })
  async login(@Body() body: { initData: string }) {
    return await this.authService.login(body.initData);
  }

  @Get('telegram')
  @ApiQuery({
    name: 'query_id',
    required: true,
    type: String,
    description: 'Query ID',
  })
  @ApiQuery({
    name: 'user',
    required: true,
    type: String,
    description: 'User information in JSON format',
  })
  @ApiQuery({
    name: 'auth_date',
    required: true,
    type: Number,
    description: 'Authorization date',
  })
  @ApiQuery({ name: 'hash', required: true, type: String, description: 'Hash' })
  async telegramAuth(
    @Query('query_id') queryId: string,
    @Query('user') userJson: string,
    @Query('auth_date') authDate: number,
    @Query('hash') hash: string,
  ) {
    const token = process.env.TG_BOT_TOKEN;

    const user = JSON.parse(decodeURIComponent(userJson));

    const dataCheckString = [
      `query_id=${queryId}`,
      `user=${userJson}`,
      `auth_date=${authDate}`,
    ]
      .sort()
      .join('\n');
    const secretKey = crypto.createHash('sha256').update(token).digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== hash) {
      console.log(computedHash, hash);
      return { status: 'error', message: 'Authentication failed' };
    }

    const userFromDB = await this.userService.findOrCreateUser(user as any);

    const jwtToken = this.authService.generateToken(userFromDB);

    return { message: 'Authenticated', token: jwtToken };
  }
}
