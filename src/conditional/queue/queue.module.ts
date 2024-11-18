import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { QueueConsumers } from './services';
import { getEnvs } from '@/utils/get-envs';
import { MailModule } from '../mail/mail.module';
import { toBoolean } from '@/utils/format';

@Module({})
export class QueueModule {
  static register(): DynamicModule {
    const parseConfig = getEnvs();
    const mailOn = parseConfig['MAIL_ON'] || false;
    const conditianlModuleImports = [];

    if (toBoolean(mailOn)) {
      conditianlModuleImports.push(MailModule);
    }

    return {
      module: QueueModule,
      imports: [
        ...conditianlModuleImports,
        BullModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const redisHost = configService.get('QUEUE_REDIS_HOST');
            const redisPort = configService.get('QUEUE_REDIS_PORT');
            const redisPassword = configService.get('QUEUE_REDIS_PASSWORD');
            return {
              redis: {
                host: redisHost,
                port: redisPort,
                password: redisPassword,
              },
              defaultJobOptions: {
                removeOnComplete: true,
                // TODO -> queue 生命周期方法
                removeOnFail: false,
              },
            };
          },
        }),
        BullModule.registerQueue(
          // {
          //   name: 'toimc',
          // },
          // { name: 'emails' },
          // { name: 'data-processing' },
          // { name: 'real-time-messages' },
          // { name: 'image-processing' },
          // 设置定时任务（邮件、短信）
          { name: 'scheduled-tasks' },
          // { name: 'order-processing' },
        ),
      ],
      providers: QueueConsumers,
      exports: [BullModule],
    };
  }
}
