import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BoostService } from './boost.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('boost')
@ApiBearerAuth()
@Controller('boost')
export class BoostController {
  constructor(private readonly boostService: BoostService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all boosts for the user' })
  @ApiQuery({
    name: 'available',
    required: false,
    type: Boolean,
    description: 'Filter to show only available boosts',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all boosts with their statuses',
  })
  async getAllBoosts(@Req() req, @Query('available') available?: string) {
    const userId = req.user.id;
    const showOnlyAvailable = available === 'true';
    return this.boostService.getAllBoosts(userId, showOnlyAvailable);
  }

  @Post('use/:boostId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Use a boost' })
  @ApiResponse({ status: 200, description: 'Boost used successfully' })
  @ApiResponse({
    status: 400,
    description: 'Boost not available or already used',
  })
  async useBoost(@Req() req, @Param('boostId') boostId: string) {
    const userId = req.user.id;
    return this.boostService.useBoost(userId, boostId);
  }

  @Post('claim/:boostId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Claim a delayed boost reward' })
  @ApiResponse({
    status: 200,
    description: 'Boost reward claimed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Boost not available or not ready to be claimed',
  })
  async claimDelayedBoost(@Req() req, @Param('boostId') boostId: string) {
    const userId = req.user.id;
    return this.boostService.claimDelayedBoost(userId, boostId);
  }
}
