import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteWordDto } from './dto/delete-word.dto';
import { SaveWordDto } from './dto/save-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './word.entity';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}

  async findALL() {
    return await this.wordRepository.find();
  }

  async save(data: SaveWordDto) {
    const word = this.wordRepository.create(data);
    return await this.wordRepository.save(word);
  }

  async update(data: UpdateWordDto) {
    return await this.wordRepository.save({
      ...data,
      updateAt: new Date(),
    });
  }

  async delete(data: DeleteWordDto) {
    return await this.wordRepository.delete(data);
  }
}
