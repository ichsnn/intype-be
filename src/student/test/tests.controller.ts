import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ComposeGrammarService } from './composegrammar/composegrammar.service';
import { SaveComposeGrammarDto } from './composegrammar/dto/save-composegrammar.dto';
import { SaveListenTypingDto } from './listentyping/dto/save-listentyping.dto';
import { ListenTypingService } from './listentyping/listentyping.service';

@Controller('/student/tests')
export class TestsController {
  constructor(
    private listenTypingService: ListenTypingService,
    private composeGrammarService: ComposeGrammarService,
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
}
