import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ComposeGrammar } from './test/composegrammar/composegrammar.entity';
import { ListenTyping } from './test/listentyping/listentyping.entity';
import { Tests } from './test/tests.entity';

@Entity()
export class Student {
  @PrimaryColumn()
  userUid: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  education: string;

  @Column({ default: () => 'NOW' })
  updatedAt: Date;

  @OneToMany(() => Tests, (tests) => tests.student)
  tests: Tests[];
}
