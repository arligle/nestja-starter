import { Module } from '@nestjs/common';
import { SshModule } from './ssh/ssh.module';

@Module({
  imports: [SshModule],
})
export class ToolsModule {}
