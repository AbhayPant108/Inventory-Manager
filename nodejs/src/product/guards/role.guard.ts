
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import tr from 'zod/v4/locales/tr.js';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector:Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const role = this.reflector.get(Roles,context.getHandler());
    if(request.user.role == role) return true
    return false
    
  }
}
