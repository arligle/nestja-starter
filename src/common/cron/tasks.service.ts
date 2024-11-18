import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

// 周期性的任务（每天，每小时，每周）
// 简单的任务，不需要持久化 -> 系统状态 -> 接口状态
// 轻量级的任务 -> 大量高并发的任务（反例） -> task queue -> nestjs bull + redis (RabbitMQ Kafka..)
@Injectable()
export class TasksService {
  logger = new Logger('TasksService');
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  // 添加定时任务
  addCronJob(name: string, cronTime: string, cb: () => void): void {
    const job = new CronJob(cronTime, cb);
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.log(`Job ${name} added and started`);
  }

  // 删除定时任务
  deleteCronJob(name: string): void {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`Job ${name} deleted`);
  }

  // 获取所有的定时任务的状态
  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDate().toJSDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }

  addInterval(name: string, milliseconds: number) {
    const callback = () => {
      this.logger.warn(`Interval ${name} executing at time (${milliseconds})!`);
    };

    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
  }

  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
    this.logger.warn(`Interval ${name} deleted!`);
  }

  getIntervals() {
    const intervals = this.schedulerRegistry.getIntervals();
    intervals.forEach((key) => this.logger.log(`Interval: ${key}`));
  }

  addTimeout(name: string, milliseconds: number) {
    const callback = () => {
      this.logger.warn(`Timeout ${name} executing after (${milliseconds})!`);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  deleteTimeout(name: string) {
    this.schedulerRegistry.deleteTimeout(name);
    this.logger.warn(`Timeout ${name} deleted!`);
  }

  getTimeouts() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach((key) => this.logger.log(`Timeout: ${key}`));
  }
}
