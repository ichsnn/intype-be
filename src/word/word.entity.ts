import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  word: string;

  @Column({
    type: 'enum',
    enum: [
      'adjective',
      'adverb',
      'conjunction',
      'interjection',
      'noun',
      'preposition',
      'pronoun',
      'verb',
    ],
  })
  type: string;

  @Column({ default: () => 'NOW' })
  updateAt: Date;

  @Column({ default: () => 'NOW' })
  createdAt: Date;
}
