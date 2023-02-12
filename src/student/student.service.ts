import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import * as bcrypt from 'bcrypt';
import { getIdentifier } from 'utils/getIdentifier';
import { JwtService } from '@nestjs/jwt';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  getEducation: any;
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.studentRepository.find();
  }

  async findStudent(uid: string) {
    return await this.studentRepository.findOneBy({ user: { uid } });
  }

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

    if (isUsernameExist) throw new Error('Username sudah ada');
    if (isEmailExist) throw new Error('Email sudah ada');

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
    const payload = { uid: user.uid, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getStudent(uid: string) {
    const student = await this.studentRepository.findOne({
      where: [{ user: { uid } }],
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
    if (!student) throw new Error('Pelajar tidak ditemukan');
    return student;
  }

  async updateProfile(uid: string, student: UpdateStudentDto) {
    const oldStudent = await this.getStudent(uid);
    const { email, username, ...studentUpdateValue } = student;

    await this.userRepository.save({
      uid: oldStudent.userUid,
      email,
      username,
      updatedAt: new Date(),
    });

    await this.studentRepository.save({
      userUid: oldStudent.userUid,
      ...studentUpdateValue,
      updatedAt: new Date(),
    });

    const newStudent = await this.getStudent(uid);

    return newStudent;
  }

  async updatePassword(uid: string, oldPassword: string, newPassword: string) {
    const oldStudent = await this.userRepository.findOneBy({ uid });

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      oldStudent.password,
    );

    if (!isPasswordValid) throw new Error('Password lama tidak sesuai');

    if (oldPassword === newPassword)
      throw new Error('Password lama dan password baru tidak boleh sama');

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);

    await this.userRepository.save({
      uid: oldStudent.uid,
      password: hashedPassword,
      updatedAt: new Date(),
    });

    const newStudent = await this.getStudent(uid);

    return newStudent;
  }
}
