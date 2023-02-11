import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveComposeGrammarDto } from './dto/save-composegrammar.dto';
import { SaveListenTypingDto } from './dto/save-listentyping.dto';
import { Tests } from './tests.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Tests)
    private testsRepository: Repository<Tests>,
  ) {}

  async findAll() {
    return await this.testsRepository.find();
  }

  async findAllBy(uid: string) {
    return await this.testsRepository.find({
      where: {
        student: {
          userUid: uid,
        },
      },
    });
  }

  async saveComposeGrammar(uid: string, data: SaveComposeGrammarDto) {
    const { questions, duration, score } = data;
    const tests = this.testsRepository.create({
      type: '1',
      duration,
      score,
      questions,
      student: {
        userUid: uid,
      },
    });
    await this.testsRepository.save(tests);
  }

  async saveListenTyping(uid: string, data: SaveListenTypingDto) {
    const { questions, duration, score } = data;
    const tests = this.testsRepository.create({
      type: '2',
      duration,
      score,
      questions,
      student: {
        userUid: uid,
      },
    });
    await this.testsRepository.save(tests);
  }

  async findAllListenTypingBy() {
    return await this.testsRepository.query(
      'SELECT * FROM tests JOIN (SELECT student.education, student.userUid, user.username, student.gender FROM student JOIN user ON student.userUid = user.uid) AS su ON tests.studentUserUid = su.userUid WHERE tests.type = 2 order by tests.score',
    );
  }

  async findAllComposeGrammar() {
    return await this.testsRepository.query(
      'SELECT * FROM tests JOIN (SELECT student.education, student.userUid, user.username, student.gender FROM student JOIN user ON student.userUid = user.uid) AS su ON tests.studentUserUid = su.userUid WHERE tests.type = 1 order by tests.score desc',
    );
  }
}
