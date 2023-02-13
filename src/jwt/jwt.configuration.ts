import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export class JwtConfiguration implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    };
  }
}
