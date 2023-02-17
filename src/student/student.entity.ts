import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tests } from './test/tests.entity';

@Entity()
export class Student {
  @PrimaryColumn()
  userUid: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'enum', enum: ['1', '2'], nullable: true, default: null })
  gender: string;

  @Column({
    type: 'enum',
    enum: ['0', '1', '2', '3', '4', '5', '6', '7'],
    default: '0',
    nullable: true,
  })
  education: string;

  @Column({ default: () => 'NOW' })
  updatedAt: Date;

  @OneToMany(() => Tests, (tests) => tests.student)
  tests: Tests[];
}
