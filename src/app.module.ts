import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { StudentAuthMiddleware } from './middlewares/studentauth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthMiddleware } from './middlewares/adminauth.middleware';
import * as routes from './shareds/constants/routes';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'intype',
      synchronize: true,
      autoLoadEntities: true,
      entities: [__dirname + './**/*.entity{.ts,.js}'],
    }),
    JwtModule.register({
      secret: 'itsasecret',
      signOptions: { expiresIn: '1w' },
    }),
    StudentModule,
    UserModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StudentAuthMiddleware)
      .forRoutes(
        routes.student.me,
        routes.student.update,
        routes.student.updatePassword,
        routes.student.tests + '/*',
      )
      .apply(AdminAuthMiddleware)
      .forRoutes(
        routes.admin.me,
        routes.words.create,
        routes.words.update,
        routes.words.delete,
      );
  }
}
