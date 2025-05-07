import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { patterns } from 'src/modules/patterns';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}
  private readonly logger = new Logger(RolesGuard.name);
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // If no roles are defined, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = await firstValueFrom(
      this.userClient.send(patterns.USER.FIND_BY_ID, request.user.member_id),
    );
    return user && requiredRoles.includes(user.role);
  }
}
