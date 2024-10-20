import { Controller, Post, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TicketService } from './ticket.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('claim')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Claim tickets for the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tickets claimed successfully',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No tickets available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async claimTickets(@Req() req) {
    const userId = req.user.id;
    return this.ticketService.claimTickets(userId);
  }
}
