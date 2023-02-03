import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { StudentController } from './student.controller';
import { Student } from './student.entity';
import { StudentService } from './student.service';

import { JwtModule } from '@nestjs/jwt';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, User]),
    JwtModule.register({
      secret: 'itsasecret',
      signOptions: { expiresIn: '1w' },
    }),
    LeaderboardsModule,
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [TypeOrmModule],
})
export class StudentModule {}
