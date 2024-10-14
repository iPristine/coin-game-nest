import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
