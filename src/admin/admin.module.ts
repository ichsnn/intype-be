import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';

import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { User } from 'src/user/user.entity';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
