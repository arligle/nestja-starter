import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('toimc')
export class ToimcConsumer {
  @Process()
  async transcode(job: Job<unknown>) {
    let progress = 0;
    for (let i = 0; i < 100; i++) {
      console.log(`job data ${job.data} progress ${progress}`);
      progress += 1;
      await job.progress(progress);
    }
    return {};
  }
}
