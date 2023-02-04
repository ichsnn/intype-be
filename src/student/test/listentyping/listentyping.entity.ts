import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Tests } from '../tests.entity';

@Entity()
export class ListenTyping {
  @PrimaryColumn('uuid')
  testsId: string;

  @OneToOne(() => Tests)
  @JoinColumn()
  tests: Tests;

  @Column({ type: 'json' })
  question: object[];
}
