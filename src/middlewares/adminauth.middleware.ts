import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization) throw new Error('Authorization header is required');
      const token = authorization.split(' ')[1];
      if (!token) throw new Error('Token is required');
      const payload = this.jwtService.verify(token);
      if (!payload) throw new Error('Invalid token');
      const { uid, role } = payload;
      if (role !== 'admin') throw new Error('Invalid token');
      if (!uid) throw new Error('Invalid token');
      req.headers.uid = uid;
      next();
    } catch (error) {
      res.status(401).json({
        code: 401,
        status: 'error',
        message: error.message,
      });
    }
  }
}
