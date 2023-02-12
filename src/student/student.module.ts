import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { StudentController } from './student.controller';
import { Student } from './student.entity';
import { StudentService } from './student.service';

import { JwtModule } from '@nestjs/jwt';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';
import { TestsModule } from './test/tests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    LeaderboardsModule,
    TestsModule,
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [TypeOrmModule, StudentService],
})
export class StudentModule {}
