import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class TelegramAuthQuery {
  @ApiProperty({
    description: 'Hash value for Telegram authentication',
    example: 'exampleHash',
    required: true,
  })
  @IsString()
  hash: string;

  @ApiProperty({
    description: 'Additional data from Telegram',
    example: '123456',
    required: false,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Additional data from Telegram',
    example: 'testuser',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Additional data from Telegram',
    example: 'Test',
    required: false,
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'Additional data from Telegram',
    example: 'User',
    required: false,
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({
    description: 'Additional data from Telegram',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiProperty({
    description: 'Additional data from Telegram',
    example: '1621341234',
    required: false,
  })
  @IsOptional()
  @IsString()
  auth_date?: string;
}
