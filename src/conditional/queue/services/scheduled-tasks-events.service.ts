import {
  OnGlobalQueueActive,
  OnGlobalQueueCleaned,
  OnGlobalQueueCompleted,
  OnGlobalQueueDrained,
  OnGlobalQueueError,
  OnGlobalQueueFailed,
  OnGlobalQueuePaused,
  OnGlobalQueueProgress,
  OnGlobalQueueRemoved,
  OnGlobalQueueResumed,
  OnGlobalQueueStalled,
  OnGlobalQueueWaiting,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';

@Processor('scheduled-tasks')
export class ScheduledTasksEventsService {
  // constructor(@InjectQueue('scheduled-tasks') private queue: Queue) {}

  @OnGlobalQueueError()
  handleGlobalError(error: Error) {
    console.error(`Global Error: ${error.message}`);
  }

  @OnGlobalQueueWaiting()
  handleGlobalWaiting(jobId: number | string) {
    console.log(`Job with ID ${jobId} is waiting.`);
  }

  @OnGlobalQueueActive()
  async handleGlobalActive(job: Job) {
    console.log(`Job ${job} is now active.`);
  }

  @OnGlobalQueueStalled()
  handleGlobalStalled(job: Job) {
    console.log(`Job ${job.id} has stalled.`);
  }

  @OnGlobalQueueProgress()
  handleGlobalProgress(job: Job, progress: number) {
    console.log(`Job ${job.id} progress: ${progress}`);
  }

  @OnGlobalQueueCompleted()
  handleGlobalCompleted(job: Job, result: any) {
    console.log(`Job ${job} completed with result: ${result}`);
  }

  @OnGlobalQueueFailed()
  handleGlobalFailed(job: Job, err: Error) {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
  }

  @OnGlobalQueuePaused()
  handleGlobalPaused() {
    console.log(`The queue has been paused.`);
  }

  @OnGlobalQueueResumed()
  handleGlobalResumed() {
    console.log(`The queue has been resumed.`);
  }

  @OnGlobalQueueCleaned()
  handleGlobalCleaned(jobs: Job[], type: string) {
    console.log(`Jobs cleaned of type ${type}: ${jobs.length}`);
  }

  @OnGlobalQueueDrained()
  handleGlobalDrained() {
    console.log(`All waiting jobs have been processed.`);
  }

  @OnGlobalQueueRemoved()
  handleGlobalRemoved(job: Job) {
    console.log(`Job ${job.id} was removed.`);
  }
}
