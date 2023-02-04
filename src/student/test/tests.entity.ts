import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../student.entity';

@Entity()
export class Tests {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['1', '2'] })
  type: string;

  @Column()
  score: number;

  @Column()
  duration: number;

  @Column({ default: () => 'NOW' })
  createdAt: Date;

  @ManyToOne(() => Student, (student) => student.tests)
  student: Student;
}
