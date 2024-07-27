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
    example: '{}',
    required: false,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Additional data from Telegram',
    example: '{}',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Additional data from Telegram',
    example: '{}',
    required: false,
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'Additional data from Telegram',
    example: '{}',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  last_name?: string;

  @ApiProperty({
    description: 'Additional data from Telegram',
    example: '{}',
    required: false,
  })
  @IsOptional()
  @IsString()
  photo_url?: string;
}
