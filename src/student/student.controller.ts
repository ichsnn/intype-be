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
        message: 'Get user success',
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
      if (!username || !email || !password) throw new Error('Missing fields');
      await this.studentService.register(email, username, password);
      response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Register success',
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
      if (!identifier || !password) throw new Error('Missing fields');
      const user = await this.studentService.validateUser(identifier, password);
      if (!user) throw new Error('Username or password is incorrect');
      const { access_token } = await this.studentService.login(user);
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
        message: 'Update profile success',
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
}
