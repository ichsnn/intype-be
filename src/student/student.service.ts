import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import * as bcrypt from 'bcrypt';
import { getIdentifier } from 'src/shareds/utils/getIdentifier';
import { JwtService } from '@nestjs/jwt';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findUserByUsername(username: string) {
    return this.studentRepository.findOneBy({ user: { username } });
  }

  async findUserByEmail(email: string) {
    return this.studentRepository.findOneBy({ user: { email } });
  }

  // Register User
  async register(email: string, username: string, password: string) {
    const isEmailExist = await this.findUserByEmail(email);
    const isUsernameExist = await this.findUserByUsername(username);

    if (isEmailExist) throw new Error('Email already exist');
    if (isUsernameExist) throw new Error('Username already exist');

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      role: 'student',
    });
    await this.userRepository.save(user);

    const student = this.studentRepository.create({
      user,
    });
    await this.studentRepository.save(student);
  }

  // Validate User
  async validateUser(identifier: string, pass: string) {
    const user = await this.userRepository.findOneBy({
      [getIdentifier(identifier)]: identifier,
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  // Login User
  async login(user: any) {
    const payload = { uid: user.uid, username: user.username, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getStudent(access_token: string) {
    const payload = this.jwtService.verify(access_token);
    const { ...student } = await this.studentRepository.findOne({
      where: [{ user: { uid: payload.uid } }],
      relations: { user: true },
      select: {
        user: {
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          email_verifiedAt: true,
        },
      },
    });
    return student;
  }

  async updateProfile(access_token: string, student: UpdateStudentDto) {
    const oldStudent = await this.getStudent(access_token);
    const { email, username, ...studentUpdateValue } = student;

    await this.userRepository.save({
      uid: oldStudent.userUid,
      email,
      username,
      updatedAt: new Date(),
    });

    const newStudent = await this.studentRepository.save({
      userUid: oldStudent.userUid,
      ...studentUpdateValue,
      updatedAt: new Date(),
    });

    return newStudent;
  }
}
