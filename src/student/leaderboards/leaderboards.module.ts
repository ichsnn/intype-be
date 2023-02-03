import { Module } from '@nestjs/common';
import { LeaderboardsController } from './leaderboards.controller';

@Module({
  imports: [],
  controllers: [LeaderboardsController],
  providers: [],
})
export class LeaderboardsModule {}
