import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('student/leaderboards')
export class LeaderboardsController {
  @Get()
  getLeaderboards(@Req() request: Request, @Res() response: Response) {
    response.status(200).json({
      code: 200,
      status: 'success',
      message: 'Get leaderboards success',
      data: null,
    });
  }
}
