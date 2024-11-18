import { Provider } from '@nestjs/common';
import { LogDbCronService } from './log-db-cron.service';

export const CronProviders: Provider[] = [LogDbCronService];
