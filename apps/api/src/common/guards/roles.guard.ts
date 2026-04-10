import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the required roles from the @Roles decorator
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    
    // 2. If no roles are defined on the route, allow access (public within the module)
    if (!requiredRoles) {
      return true;
    }

    // 3. Get the user from the request (populated by JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // 4. Check if the user exists and has the required role
    // .includes in case need to support multiple roles per user later
    return requiredRoles.some((role) => user?.role === role);
  }
}
