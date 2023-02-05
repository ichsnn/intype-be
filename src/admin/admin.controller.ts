import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('get')
  async get(@Req() request: Request, @Res() response: Response) {
    try {
      const uid = request.headers.uid as string;
      const admin = await this.adminService.getAdmin(uid);
      response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Get user success',
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
        if (!admin) throw new Error('Username or password is incorrect');
        const { access_token } = await this.adminService.login(admin);
        response.status(200).json({
          code: 200,
          status: 'success',
          message: 'Login success',
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
        message: 'Username and password required',
        data: null,
      });
    }
  }
}
