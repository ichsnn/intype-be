import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';

import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { User } from 'src/user/user.entity';
import { AdminController } from './admin.controller';
import { JwtConfiguration } from 'src/jwt/jwt.configuration';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User]),
    JwtModule.registerAsync({
      useClass: JwtConfiguration,
    }),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
