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
import * as routes from './shareds/constants/routes';
import { WordModule } from './word/word.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host:
        process.env.NODE_ENV === 'production'
          ? process.env.DB_HOST
          : 'localhost',
      port:
        process.env.NODE_ENV === 'production'
          ? parseInt(process.env.DB_PORT, 10)
          : 3306,
      username:
        process.env.NODE_ENV === 'production' ? process.env.DB_USER : 'root',
      password:
        process.env.NODE_ENV === 'production' ? process.env.DB_PASSWORD : '',
      database:
        process.env.NODE_ENV === 'production' ? process.env.DB_NAME : 'intype',
      synchronize: process.env.NODE_ENV === 'production' ? false : true,
      autoLoadEntities: true,
      entities: [__dirname + './**/*.entity{.ts,.js}'],
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
