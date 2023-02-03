import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { JwtService } from '@nestjs/jwt';

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

    const isPasswordValid = pass == user.password;

    if (!isPasswordValid) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { uid: user.uid, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAdmin(access_token: string) {
    const payload = this.jwtService.verify(access_token);
    const admin = await this.adminRepository.findOne({
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
    return admin;
  }
}
