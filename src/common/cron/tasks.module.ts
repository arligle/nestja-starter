import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronProviders } from './tasks/index';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService, ...CronProviders],
  exports: [TasksService],
})
export class TasksModule {}
