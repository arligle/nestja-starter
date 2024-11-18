import { DynamicModule, Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { toBoolean } from '../utils/format';
import { MailModule } from './mail/mail.module';
// import { StorageModule } from './storage/storage.module';
import { SshModule } from '@/utils/ssh/ssh.module';
import { TasksModule } from '@/common/cron/tasks.module';
import { getEnvs } from '@/utils/get-envs';
import { QueueModule } from './queue/queue.module';

const imports = [];
const providers = [];
const exportsService = [];

@Module({})
export class ConditionalModule {
  static register(): DynamicModule {
    const parsedConfig = getEnvs();
    if (toBoolean(parsedConfig['MAIL_ON'])) {
      imports.push(MailModule);
    }
    if (toBoolean(parsedConfig['QUEUE_ON'])) {
      imports.push(QueueModule.register());
    }
    if (toBoolean(parsedConfig['CRON_ON'])) {
      imports.push(TasksModule);
      imports.push(
        SshModule.forRoot({
          host: '192.168.31.77',
          username: 'root',
          password: '123456',
          port: 22,
        }),
      );
    }

    return {
      module: ConditionalModule,
      imports: imports,
      providers: providers,
      exports: exportsService,
    };
  }
}
