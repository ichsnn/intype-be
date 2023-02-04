import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveListenTypingDto } from './dto/save-listentyping.dto';
import { ListenTyping } from './listentyping.entity';
import { Tests } from '../tests.entity';

@Injectable()
export class ListenTypingService {
  constructor(
    @InjectRepository(ListenTyping)
    private listenTypingRepository: Repository<ListenTyping>,

    @InjectRepository(Tests)
    private testsRepository: Repository<Tests>,
  ) {}

  async save(uid: string, data: SaveListenTypingDto) {
    const { question, duration, score } = data;
    const tests = this.testsRepository.create({
      type: '2',
      duration,
      score,
      student: {
        userUid: uid,
      },
    });
    await this.testsRepository.save(tests);

    const listenTyping = this.listenTypingRepository.create({
      question,
      tests: {
        id: tests.id,
      },
    });
    return await this.listenTypingRepository.save(listenTyping);
  }
}
