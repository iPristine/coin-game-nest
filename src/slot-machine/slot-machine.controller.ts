import { Controller, Get, Post, UseGuards, Req, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SlotMachineService } from './slot-machine.service';

@ApiTags('slot-machine')
@ApiBearerAuth()
@Controller('slot-machine')
export class SlotMachineController {
  constructor(private readonly slotMachineService: SlotMachineService) {}

  @Get('spin')
  @UseGuards(JwtAuthGuard)
  async spin(@Req() req) {
    try {
      const userId = req.user.id;
      return this.slotMachineService.spin(userId);
    } catch (error) {
      console.error('Error spinning slot machine:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
