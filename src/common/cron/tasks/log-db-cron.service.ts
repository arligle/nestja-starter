import { SshService } from '@/utils/ssh/ssh.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LogDbCronService {
  constructor(private sshService: SshService) {}

  @Cron('0 * 0 * * *', { name: 'logdb-cron' })
  async handleCron() {
    // 备份：连接到MongoDB并导出对应的db中的collections的数据
    // 滚动记录：删除已有的collections的数据
    // 1. 删除当前collections中的已备份数据
    // 2. 之前备份的collections -> 对比collection备份的时间，如果超过 t 天/hours的规则，则删除
    const containerName = 'mongo-mongo-1';
    const uri = 'mongodb://root:example@localhost:27017/nest-logs';
    const now = new Date();
    const collectionName = 'log';
    const outputPath = `/tmp/logs-${now.getTime()}`;
    const hostBackupPath = '/srv/logs';
    const cmd = `docker exec -i ${containerName} mongodump --uri=${uri} --collection=${collectionName} --out=${outputPath}`;
    const cpCmd = `docker cp ${containerName}:${outputPath} ${hostBackupPath}`;
    await this.sshService.exec(`${cmd} && ${cpCmd}`);
    await this.sshService.exec(`ls -la ${hostBackupPath}`);

    const delCmd = `find ${hostBackupPath} -type d -mtime +30 -exec rm -rf {} \\;`;
    await this.sshService.exec(delCmd);

    const res = await this.sshService.exec(`ls -la ${hostBackupPath}`);
    console.log('🚀 ~ TasksService ~ handleCron ~ res:', res);
  }
}
