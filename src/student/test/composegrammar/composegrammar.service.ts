import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { openai } from 'src/shareds/openai/openai.service';
import { Repository } from 'typeorm';
import { Tests } from '../tests.entity';
import { ComposeGrammar } from './composegrammar.entity';
import { SaveComposeGrammarDto } from './dto/save-composegrammar.dto';

@Injectable()
export class ComposeGrammarService {
  constructor(
    @InjectRepository(ComposeGrammar)
    private composeGrammarRepository: Repository<ComposeGrammar>,

    @InjectRepository(Tests)
    private testsRepository: Repository<Tests>,
  ) {}

  async save(uid: string, data: SaveComposeGrammarDto) {
    const { question, duration, score } = data;
    const tests = this.testsRepository.create({
      type: '1',
      duration,
      score,
      student: {
        userUid: uid,
      },
    });
    await this.testsRepository.save(tests);

    const composeGrammar = this.composeGrammarRepository.create({
      question,
      tests: {
        id: tests.id,
      },
    });
    return await this.composeGrammarRepository.save(composeGrammar);
  }

  async find() {
    console.log('masuk find compose grammar');
    return await this.composeGrammarRepository.find();
  }
}
