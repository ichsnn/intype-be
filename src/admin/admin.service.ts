import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Validate User
  async validateUser(username: string, pass: string) {
    const user = await this.userRepository.findOneBy({
      username: username,
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { uid: user.uid, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAdmin(uid: string) {
    const admin = await this.adminRepository.findOne({
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
    return admin;
  }

  async register(username: string, email: string, password: string) {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
    });
    await this.userRepository.save(user);
    const admin = this.adminRepository.create({
      user,
    });
    await this.adminRepository.save(admin);
    return admin;
  }
}
