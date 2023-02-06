import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StudentService } from './student.service';
import { getEducation } from 'src/shareds/utils/getEducation';

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
      if (!user) throw new Error('Kredensial salah');
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

  @Get('count')
  async count(@Req() request: Request, @Res() response: Response) {
    try {
      const student = await this.studentService.findAll();
      const count = student.length;
      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil mendapatkan jumlah pengguna',
        data: count,
      });
    } catch (error) {
      response.status(400).json({
        code: 400,
        status: 'error',
        message: error.message,
      });
    }
  }

  @Get('stats/education')
  async statistics(@Req() request: Request, @Res() response: Response) {
    try {
      const student = await this.studentService.findAll();
      const education = student.map((student) => {
        return {
          name: getEducation[student.education] || 'Tidak Diketahui',
          value: 1,
        };
      });
      // group the array by name
      const grouped = education.reduce((r, a) => {
        r[a.name] = [...(r[a.name] || []), a];
        return r;
      }, {});
      // sum the value of each group
      const result = Object.keys(grouped).map((key) => {
        return {
          name: key,
          value: grouped[key].reduce((sum, item) => sum + item.value, 0),
        };
      });
      // data pendidikan yang tidak ada di database
      const notFound = Object.keys(getEducation).filter(
        (key) => !result.find((item) => item.name === getEducation[key]),
      );
      // tambahkan data pendidikan yang tidak ada di database
      notFound.forEach((item) => {
        result.push({
          name: getEducation[item],
          value: 0,
        });
      });
      if (!result.find((item) => item.name === 'Tidak Diketahui')) {
        result.push({
          name: 'Tidak Diketahui',
          value: 0,
        });
      }
      result.sort((a, b) => {
        if (a.name === 'Tidak Diketahui') return -1;
        if (b.name === 'Tidak Diketahui') return 1;
        return getEducation[a.name] - getEducation[b.name];
      });
      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil mendapatkan data statistik pengguna',
        data: result,
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
