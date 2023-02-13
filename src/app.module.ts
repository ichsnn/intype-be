import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { StudentAuthMiddleware } from './middlewares/studentauth.middleware';
import { AdminAuthMiddleware } from './middlewares/adminauth.middleware';
import * as routes from '../constants/routes';
import { WordModule } from './word/word.module';
import { OpenaiModule } from './openai/openai.module';
import { DatabaseConfiguration } from '../config/database.configuration';
import { JwtConfiguration } from './jwt/jwt.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useClass: JwtConfiguration,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),
    StudentModule,
    UserModule,
    AdminModule,
    WordModule,
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StudentAuthMiddleware)
      .exclude('student/tests/count')
      .forRoutes(
        routes.student.me,
        routes.student.update,
        routes.student.updatePassword,
        routes.student.tests + '/*',
      )
      .apply(AdminAuthMiddleware)
      .forRoutes(
        routes.admin.me,
        routes.admin.register,
        routes.words.create,
        routes.words.update,
        routes.words.delete,
      );
  }
}
