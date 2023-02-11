import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../student.entity';

@Entity()
export class Tests {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['1', '2'] })
  type: string;

  @Column({ nullable: false })
  score: number;

  @Column({ nullable: false })
  duration: number;

  @Column({ default: () => 'NOW' })
  createdAt: Date;

  @Column('longtext', { nullable: false })
  questions: string;

  @ManyToOne(() => Student, (student) => student.tests)
  student: Student;
}
