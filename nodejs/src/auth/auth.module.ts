import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '600s' },
    }),],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports:[AuthService]
})
export class AuthModule { }
