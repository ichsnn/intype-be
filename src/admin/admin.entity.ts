import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
