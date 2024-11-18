import { DynamicModule, Module } from '@nestjs/common';
import { SshCoreModule } from './ssh-core.module';
import { SshModuleAyncOptions, SshModuleOptions } from './ssh.interface';

@Module({})
export class SshModule {
  // forRoot -> 直传options
  static forRoot(options: SshModuleOptions, name?: string): DynamicModule {
    return {
      module: SshModule,
      imports: [SshCoreModule.forRoot(options, name)],
    };
  }
  // forRootAsync -> useFactory -> inject configService
  static forRootAync(
    options: SshModuleAyncOptions,
    name?: string,
  ): DynamicModule {
    return {
      module: SshModule,
      imports: [SshCoreModule.forRootAync(options, name)],
    };
  }
}
