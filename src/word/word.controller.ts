import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { DeleteWordDto } from './dto/delete-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { WordService } from './word.service';

@Controller('words')
export class WordController {
  constructor(private wordService: WordService) {}

  @Get()
  async getAll(@Req() request: Request, @Res() response: Response) {
    try {
      const words = await this.wordService.findALL();
      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil mendapatkan data kata',
        data: words,
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

  @Post('create')
  async save(@Req() request: Request, @Res() response: Response) {
    try {
      const data = request.body;
      const word = await this.wordService.save(data);
      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil menambahkan kata',
        data: word,
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

  @Post('update')
  async update(@Req() request: Request, @Res() response: Response) {
    try {
      const data = request.body as UpdateWordDto;
      const word = await this.wordService.update(data);
      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil memperbarui kata',
        data: word,
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

  @Post('delete')
  async delete(@Req() request: Request, @Res() response: Response) {
    try {
      const data = request.body as DeleteWordDto;
      await this.wordService.delete(data);
      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil menghapus kata',
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

  @Get('random')
  async getRandom(@Req() request: Request, @Res() response: Response) {
    try {
      const words = await this.wordService.findALL();
      const randomIndex = Math.floor(Math.random() * words.length);
      const randomWord = words[randomIndex];
      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'Berhasil mendapatkan kata acak',
        data: randomWord,
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
