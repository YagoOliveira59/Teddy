import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  private readonly guard: CanActivate;

  constructor() {
    const GuardClass = AuthGuard('local');
    this.guard = new GuardClass();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.guard.canActivate(context);
  }
}
