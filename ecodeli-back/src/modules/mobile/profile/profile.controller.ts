import { Body, Controller, Get,  Post,  UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import {  CalendarEvent, ProfileClient } from './type';
import { ClientJwtGuard } from 'src/common/guards/user-jwt.guard';




@ApiTags('Client Profile Management')
@Controller('mobile/profile')
export class ClientProfileController {
  constructor(private readonly profileService : ProfileService) {}

  @Get('me')
  @UseGuards(ClientJwtGuard)
  @ApiOperation({
    summary: 'Get My Profile',
    operationId: 'getMyProfile',
  })
  @ApiResponse({ status: 200, description: 'Client profile retrieved successfully' })
  async getMyProfile(@Body() body: { user_id: string }): Promise<ProfileClient> {
    const { user_id } = body;
    const user = await this.profileService.getMyProfile(user_id);
    if (!user) {
      throw new Error('Client not found');
    }
    return user;
  }

  @Post('reports')
  @UseGuards(ClientJwtGuard)
  @ApiOperation({
    summary: 'Report a Client',
    operationId: 'reportClient',
  })
  @ApiResponse({ status: 200, description: 'Client reported successfully' })
  async reportClient(@Body() body: { user_id: string, content: string }): Promise<{ message: string }> {
    const { user_id, content } = body;
    const result = await this.profileService.createReport(user_id, content);
    if (!result) {
      throw new Error('Failed to report client');
    }
    return { message: 'Client reported successfully' };
  }

  @Get('planning')
  @UseGuards(ClientJwtGuard)
  @ApiOperation({
    summary: 'Get My Planning',
    operationId: 'getMy Planning',
  })
  @ApiResponse({ status: 200, description: 'Client planning retrieved successfully' })
  async getMyPlanning(@Body() body: { user_id: string }): Promise<CalendarEvent[]> {
    const { user_id } = body;
    const planning = await this.profileService.getPlanning(user_id);
    if (!planning) {
      throw new Error('Client planning not found');
    }
    return planning;
  }

}
