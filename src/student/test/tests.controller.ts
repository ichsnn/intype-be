import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ComposeGrammarService } from './composegrammar/composegrammar.service';
import { SaveComposeGrammarDto } from './composegrammar/dto/save-composegrammar.dto';
import { SaveListenTypingDto } from './listentyping/dto/save-listentyping.dto';
import { ListenTypingService } from './listentyping/listentyping.service';
import { TestsService } from './tests.service';

@Controller('/student/tests')
export class TestsController {
  constructor(
    private listenTypingService: ListenTypingService,
    private composeGrammarService: ComposeGrammarService,
    private testService: TestsService,
  ) {}
  @Get('listentyping')
  async getListenTyping(@Req() request: Request, @Res() response: Response) {
    try {
      response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil mendapatkan data listen typing',
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

  @Post('listentyping')
  async saveListenTyping(@Req() request: Request, @Res() response: Response) {
    try {
      const uid = request.headers.uid as string;
      const { score, duration, question }: SaveListenTypingDto = request.body;
      if (!score || !duration || !question)
        throw new Error('Field tidak sesuai');
      const data = await this.listenTypingService.save(uid, {
        score,
        duration,
        question,
      });
      response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Data listen typing berhasil disimpan',
        data: data,
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

  @Post('composegrammar')
  async saveComposeGrammar(@Req() request: Request, @Res() response: Response) {
    try {
      const uid = request.headers.uid as string;
      const { score, duration, question }: SaveComposeGrammarDto = request.body;
      if (!score || !duration || !question)
        throw new Error('Field tidak sesuai');
      const data = await this.composeGrammarService.save(uid, {
        score,
        duration,
        question,
      });
      response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Data compose grammar berhasil disimpan',
        data: data,
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

  @Get('count')
  async getCount(@Req() request: Request, @Res() response: Response) {
    try {
      const tests = await this.testService.findAll();
      const count = tests.length;
      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil mendapatkan jumlah data tests',
        data: count,
      });
    } catch (error) {
      return response.status(400).json({
        code: 400,
        status: 'error',
        message: error.message,
        data: null,
      });
    }
  }

  @Get('stats/listentyping/week')
  async getListenTypingStatsWeek(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const uid = request.headers.uid as string;
      if (!uid) throw new Error('Field tidak sesuai');

      const data = await this.testService.findAllBy(uid);

      const result = {
        1: [],
        2: [],
      };

      data.forEach((item) => {
        if (item.type === '1') {
          result[1].push({
            Tanggal: item.createdAt.toISOString().split('T')[0],
            Skor: item.score,
          });
        } else if (item.type === '2') {
          result[2].push({
            Tanggal: item.createdAt.toISOString().split('T')[0],
            Skor: item.score,
          });
        }
        return result;
      });

      // get last 7 days until now
      const last7Days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d);
      }

      const result2 = {
        1: [],
        2: [],
      };

      last7Days.forEach((item) => {
        const date = item.toISOString().split('T')[0];

        const composeGrammar = result[1].filter(
          (item) => item.Tanggal === date,
        );
        const listenTyping = result[2].filter((item) => item.Tanggal === date);

        if (composeGrammar.length > 0) {
          const max = composeGrammar.reduce((prev, current) =>
            prev.Skor > current.Skor ? prev : current,
          );
          result2[1].push({
            Tanggal: date,
            Skor: max.Skor,
          });
        } else {
          result2[1].push({
            Tanggal: date,
            Skor: 0,
          });
        }

        if (listenTyping.length > 0) {
          const max = listenTyping.reduce((prev, current) =>
            prev.Skor > current.Skor ? prev : current,
          );
          result2[2].push({
            Tanggal: date,
            Skor: max.Skor,
          });
        } else {
          result2[2].push({
            Tanggal: date,
            Skor: 0,
          });
        }
      });

      result2[1].reverse();
      result2[2].reverse();

      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil mendapatkan data statistik listen typing',
        data: result2,
      });
    } catch (error) {
      return response.status(400).json({
        code: 400,
        status: 'error',
        message: error.message,
        data: null,
      });
    }
  }
}
