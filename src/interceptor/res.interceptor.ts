import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { map } from 'rxjs/operators';

@Injectable()
export class ResInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): import("rxjs").Observable<any> | Promise<import("rxjs").Observable<any>> {
    return next.handle().pipe(map(data => ({ statusCode: 200, data })))
  }
}