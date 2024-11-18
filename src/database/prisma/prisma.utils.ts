import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { catchError, retry, throwError, timer } from 'rxjs';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<Prisma.TransactionClient>();

export const PROTOCALREGEX = /^(.*?):\/\//;

export function getDBType(url: string) {
  const matches = url.match(PROTOCALREGEX);

  const protocol = matches ? matches[1] : 'file';

  return protocol === 'file' ? 'sqlite' : protocol;
}

export function handleRetry(retryAttempts: number, retryDelay: number) {
  const logger = new Logger('PrismaModule');
  return (source) =>
    source.pipe(
      retry({
        count: retryAttempts < 0 ? Infinity : retryAttempts,
        delay: (error, retryCount) => {
          // console.log('🚀 ~ handleRetry ~ retryCount:', retryCount);
          const attemps = retryAttempts < 0 ? Infinity : retryAttempts;
          if (retryCount <= attemps) {
            logger.error(
              `Unable to connect to the database. Retrying (${retryCount})...`,
              error.stack,
            );
            return timer(retryDelay);
          } else {
            return throwError(() => new Error('Reached max retries'));
          }
        },
      }),
      catchError((error) => {
        logger.error(
          `Failed to connect to the database after retries ${retryAttempts} times`,
          error.stack || error,
        );
        return throwError(() => error);
      }),
    );
}

// https://github.com/prisma/prisma/discussions/12373
// https://github.com/prisma/prisma/issues/17215
export function extendTransaction(tx: Prisma.TransactionClient) {
  return new Proxy(tx, {
    get(target, p) {
      if (p === '$transaction') {
        return async (fn) => fn(tx);
      }
      return target[p];
    },
  });
}
