import { ExecutionContext, Injectable, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from, isObservable, Observable, of, switchMap } from 'rxjs';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class PassportLocalGuard extends AuthGuard('local') {
  private readonly validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return from(
      this.validationPipe.transform(request.body, {
        type: 'body',
        metatype: LoginDto,
      }),
    ).pipe(
      switchMap((validatedBody) => {
        request.body = validatedBody;

        const result = super.canActivate(context);

        if (isObservable(result)) {
          return result;
        }

        if (typeof result === 'boolean') {
          return of(result);
        }

        return from(result);
      }),
    );
  }
}
