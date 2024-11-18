import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { PrismaConfigService } from './prisma-config.service';
import { PRISMA_DATABASE } from '../databse.constants';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      name: PRISMA_DATABASE,
      useClass: PrismaConfigService,
    }),
  ],
  providers: [],
  exports: [],
})
export class PrismaCommonModule {}