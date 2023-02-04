import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ListenTypingService } from './listentyping.service';
import { ListenTyping } from './listentyping.entity';
import { Tests } from '../tests.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListenTyping, Tests]),
    JwtModule.register({
      secret: 'itsasecret',
      signOptions: { expiresIn: '1w' },
    }),
  ],
  providers: [ListenTypingService],
  exports: [TypeOrmModule, ListenTypingService],
})
export class ListenTypingModule {}
