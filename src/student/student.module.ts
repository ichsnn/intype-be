import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { StudentController } from './student.controller';
import { Student } from './student.entity';
import { StudentService } from './student.service';

import { JwtModule } from '@nestjs/jwt';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';
import { TestsModule } from './test/tests.module';
import { JwtConfiguration } from 'config/jwt.configuration';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, User]),
    JwtModule.registerAsync({
      useClass: JwtConfiguration,
    }),
    LeaderboardsModule,
    TestsModule,
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [TypeOrmModule, StudentService],
})
export class StudentModule {}
