import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('/get')
  async get(@Req() request: Request, @Res() response: Response) {
    try {
      const { authorization } = request.headers;
      if (!authorization) throw new Error('Unauthorized');
      const headerAuth = authorization.split(' ');
      if (headerAuth[0] !== 'Bearer') throw new Error('Unauthorized');
      const token = headerAuth[1];
      const student = await this.studentService.getStudent(token);
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
      const { authorization } = request.headers;
      if (!authorization) throw new Error('Unauthorized');
      const headerAuth = authorization.split(' ');
      if (headerAuth[0] !== 'Bearer') throw new Error('Unauthorized');
      const token = headerAuth[1];
      const newStudentData = request.body;
      const student = await this.studentService.updateProfile(
        token,
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
