import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: any,
    private flag?: boolean,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('这里是在拦截器执行之前');
    return next.handle().pipe(
      map((data) => {
        // console.log('这里是在拦截器执行之后', data);
        // delete data['password'];
        return plainToInstance(this.dto, data, {
          // 设置了true之后，所有经过该拦截器的接口都需要配置Expose或者Exclude的class类属性
          // Expose -> 需要暴露的属性，
          // Exclude -> 不需要暴露的属性
          excludeExtraneousValues: this.flag,
          enableImplicitConversion: true,
        });
      }),
    );
  }
}
