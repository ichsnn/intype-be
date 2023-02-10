import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListenTypingService } from './listentyping.service';
import { ListenTyping } from './listentyping.entity';
import { Tests } from '../tests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListenTyping, Tests])],
  providers: [ListenTypingService],
  exports: [TypeOrmModule, ListenTypingService],
})
export class ListenTypingModule {}
