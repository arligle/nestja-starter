import { ModuleMetadata, Type } from '@nestjs/common';
import { ConnectConfig } from 'ssh2';

export interface SshOptionsFactory {
  createSshOptions(): Promise<SshModuleOptions> | SshModuleOptions;
}

export interface SshModuleOptions extends ConnectConfig {}

export interface SshModuleAyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<SshOptionsFactory>;
  useClass?: Type<SshOptionsFactory>;
  useFactory?: (...args: any[]) => SshModuleOptions | Promise<SshModuleOptions>;
  inject?: any[];
}
