import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { type Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request:Request = context.switchToHttp().getRequest()
    
    // 1. Correct the plural 'cookies'
    const token = request.cookies.access_token

    
    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      // 2. Verify the token (throws error if invalid/expired)
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });

      // 3. Assign payload to request so controllers can use it
      request['user'] = payload;
    } catch (error) {
      // If verification fails (expired, wrong secret, etc.)
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}