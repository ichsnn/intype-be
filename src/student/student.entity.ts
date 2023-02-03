import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';

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
}
