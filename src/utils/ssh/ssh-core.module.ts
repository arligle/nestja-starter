import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import {
  SshModuleAyncOptions,
  SshModuleOptions,
  SshOptionsFactory,
} from './ssh.interface';
import { SshService } from './ssh.service';
import { SSH_OPTIONS } from './ssh.constants';

@Module({})
@Global()
export class SshCoreModule {
  // forRoot -> 直传options
  static forRoot(options: SshModuleOptions, name?: string): DynamicModule {
    const sshOptionsProvider: Provider = {
      provide: name ? name + ':SSH_OPTIONS' : SSH_OPTIONS,
      useValue: options,
    };

    const sshClientProviders: Provider[] = [];
    if (name) {
      sshClientProviders.push({
        provide: `${name}:SSH`,
        useFactory: async () => {
          const ssh = new SshService(options);
          await ssh.connect();
          return ssh;
        },
      });
    } else {
      sshClientProviders.push(SshService);
    }
    return {
      module: SshCoreModule,
      providers: [sshOptionsProvider, ...sshClientProviders],
      exports: [...sshClientProviders],
    };
  }

  static createAsyncProviders(options: SshModuleAyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<SshOptionsFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  static createAsyncOptionsProvider(options: SshModuleAyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: SSH_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject =
      options.useClass || (options.useExisting as Type<SshOptionsFactory>);

    return {
      provide: SSH_OPTIONS,
      useFactory: async (optionsFactory: SshOptionsFactory) =>
        await optionsFactory.createSshOptions(),
      inject: [inject],
    };
  }

  // forRootAsync -> useFactory -> inject configService
  static forRootAync(
    options: SshModuleAyncOptions,
    name?: string,
  ): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    const sshClientProviders: Provider[] = [];
    if (name) {
      sshClientProviders.push({
        provide: `${name}:SSH`,
        useFactory: async (options: SshModuleOptions) => {
          const ssh = new SshService(options);
          await ssh.connect();
          return ssh;
        },
        inject: [SSH_OPTIONS],
      });
    } else {
      sshClientProviders.push(SshService);
    }
    return {
      module: SshCoreModule,
      providers: [...asyncProviders, ...sshClientProviders],
      exports: [...sshClientProviders],
    };
  }
}
