import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'student'], nullable: false })
  role: string;

  @Column({ default: null })
  email_verifiedAt: Date;

  @Column({ default: () => 'NOW' })
  createdAt: Date;

  @Column({ default: () => 'NOW' })
  updatedAt: Date;
}
