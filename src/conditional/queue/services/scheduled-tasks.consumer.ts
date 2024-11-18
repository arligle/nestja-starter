import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Logger, Optional } from '@nestjs/common';
import { Job } from 'bull';

@Processor('scheduled-tasks')
export class ScheduledTasksCosumer {
  logger = new Logger('ScheduledTasksCosumer');
  // 邮件服务
  // 短信服务
  constructor(@Optional() private mailerService: MailerService) {}

  // 发送邮件单个任务
  @Process('sendMail')
  async sendMail(job: Job<ISendMailOptions>) {
    const { data } = job;
    if (!this.mailerService) {
      this.logger.warn('Mail邮件配置异常，请检查.env的MAIL配置');
      return;
    }
    await this.mailerService.sendMail(data);
    // TODO 写到数据库
    // console.log('🚀 ~ ScheduledTasksCosumer ~ sendMail ~ res:', res);
  }

  // 发送短信单个任务
  @Process('sendSms')
  async sendSms(job: Job<unknown>) {
    console.log('in sendSms');
    return 'ok';
  }
}
