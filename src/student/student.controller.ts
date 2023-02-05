import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('me')
  async get(@Req() request: Request, @Res() response: Response) {
    try {
      const uid = request.headers.uid as string;
      const student = await this.studentService.getStudent(uid);
      response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil mendapatkan data pengguna',
        data: student,
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

  @Post('register')
  async register(@Req() request: Request, @Res() response: Response) {
    try {
      const { username, email, password } = request.body;
      if (!username || !email || !password)
        throw new Error('Field tidak sesuai');
      await this.studentService.register(email, username, password);
      response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil mendaftarkan pengguna',
        data: null,
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
    try {
      const { identifier, password } = request.body;
      if (!identifier || !password) throw new Error('Field tidak sesuai');
      const user = await this.studentService.validateUser(identifier, password);
      if (!user) throw new Error('Username atau password salah');
      const { access_token } = await this.studentService.login(user);
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
  }

  @Post('update')
  async update(@Req() request: Request, @Res() response: Response) {
    try {
      const uid = request.headers.uid as string;
      const newStudentData = request.body;
      const student = await this.studentService.updateProfile(
        uid,
        newStudentData,
      );
      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil memperbarui data pengguna',
        data: student,
      });
    } catch (error) {
      response.status(400).json({
        code: 400,
        status: 'error',
        message: error.message,
      });
    }
  }

  @Post('update/password')
  async updatePassword(@Req() request: Request, @Res() response: Response) {
    try {
      const uid = request.headers.uid as string;
      const { oldPassword, newPassword } = request.body;
      if (!oldPassword || !newPassword) throw new Error('Field tidak sesuai');
      await this.studentService.updatePassword(uid, oldPassword, newPassword);
      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil memperbarui password pengguna',
        data: null,
      });
    } catch (error) {
      response.status(400).json({
        code: 400,
        status: 'error',
        message: error.message,
      });
    }
  }
}
