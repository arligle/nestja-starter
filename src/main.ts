import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import {
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configServcie = app.get(ConfigService);
  const port = configServcie.get<number>('PORT', 3000);
  const cors = configServcie.get('CORS', false);
  const prefix = configServcie.get('PREFIX', '/api');

  const versionStr = configServcie.get<string>('VERSION');
  let version = [versionStr];
  if (versionStr && versionStr.indexOf(',')) {
    version = versionStr.split(',');
  }
  const errorFilterFlag = configServcie.get<string>('ERROR_FILTER');

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion:
      typeof versionStr === 'undefined' ? VERSION_NEUTRAL : version,
  });

  if (cors === 'true') {
    // 允许跨域
    // https://docs.nestjs.com/security/cors
    app.enableCors();
  }

  if (errorFilterFlag === 'true') {
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  }

  app.enableShutdownHooks();
  // 全局类校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      // true - 去除类上不存在的字段，false - 不会去除
      whitelist: true,
      // transform: 自动转换请求对象到 DTO 实例
      transform: true,
      transformOptions: {
        // 允许类转换器隐式转换字段类型，如将字符串转换为数字等。
        enableImplicitConversion: true,
      },
    }),
  );

  // 全局守卫
  // 无法来使用UserService一类依赖注入的实例
  // app.useGlobalGuards()

  // app.useGlobalInterceptors(new SerializeInterceptor());

  await app.listen(port);
}
bootstrap();
