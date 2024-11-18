import { Inject, Injectable } from '@nestjs/common';
import { SshModuleOptions } from './ssh.interface';
import { Client } from 'ssh2';
import * as fs from 'fs';
import { SSH_OPTIONS } from './ssh.constants';

@Injectable()
export class SshService {
  // inject 'SSH_OPTIONS' -> Client connect(options) -> instance ssh
  // exec
  private client: Client = new Client();
  private isConnected: boolean = false;

  constructor(@Inject(SSH_OPTIONS) private options: SshModuleOptions) {}

  connect(): Promise<any> {
    if (this.isConnected) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const privateKey = this.options.privateKey
        ? fs.readFileSync(this.options.privateKey)
        : undefined;
      const newOptions = {
        ...this.options,
        privateKey,
      };

      this.client
        .on('ready', () => {
          this.isConnected = true;
          resolve(true);
        })
        .on('error', (err) => {
          reject(err);
        })
        .connect(newOptions);
    });
  }

  exec(
    cmd: string,
    onData?: any,
  ): Promise<{ code: number; signal: string; output: string }> {
    return new Promise(async (resolve, reject) => {
      await this.connect();
      this.client.exec(cmd, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        let output = '';
        stream
          .on('close', (code, signal) => {
            resolve({
              code,
              signal,
              output,
            });
          })
          .on('data', (data) => {
            output += data.toString();
            if (onData) onData(data.toString());
          })
          .stderr.on('data', (data) => {
            output += `ERROR: ${data.toString()}`;
            if (onData) onData(`ERROR: ${data.toString()}`);
          });
      });
    });
  }
}
