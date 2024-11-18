import { Provider } from '@nestjs/common';
import { ScheduledTasksCosumer } from './scheduled-tasks.consumer';
import { ScheduledTasksEventsService } from './scheduled-tasks-events.service';

export const QueueConsumers: Provider[] = [
  ScheduledTasksCosumer,
  ScheduledTasksEventsService,
];
