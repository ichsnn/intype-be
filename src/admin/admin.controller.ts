import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('me')
  async get(@Req() request: Request, @Res() response: Response) {
    try {
      const uid = request.headers.uid as string;
      const admin = await this.adminService.getAdmin(uid);
      response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Data pengguna berhasil diambil',
        data: admin,
      });
    } catch (error) {
      response.status(400).json({
        code: 400,
        status: 'error',
        message: error.message,
        data: null,
      });
    }
  }

  @Post('login')
  async login(@Req() request: Request, @Res() response: Response) {
    const { username, password } = request.body;
    if (username && password) {
      try {
        const admin = await this.adminService.validateUser(username, password);
        if (!admin) throw new Error('Username atau password salah');
        const { access_token } = await this.adminService.login(admin);
        response.status(200).json({
          code: 200,
          status: 'success',
          message: 'Berhasil masuk ke akun',
          data: {
            access_token,
          },
        });
      } catch (error) {
        response.status(400).json({
          code: 400,
          status: 'error',
          message: error.message,
          data: null,
        });
      }
    } else {
      response.status(400).json({
        code: 400,
        status: 'error',
        message: 'Username atau password tidak boleh kosong',
        data: null,
      });
    }
  }
}
