import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
