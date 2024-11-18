import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

// 公共模块
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { CacheCommonModule } from './common/cache/cache-common.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

// 工具模块
import { ToolsModule } from './utils/tools.module';
// 第三方可选模块
import { ConditionalModule } from './conditional/conditional.module';
// 权限相关模块
import { AccessControlModule } from './access-control/access-control.module';
// 特性模块 -> 业务模块
import { FeaturesModule } from './modules/features.module';

@Module({
  imports: [
    ConfigModule,
    LogsModule,
    CacheCommonModule,
    DatabaseModule,
    UserModule,
    AccessControlModule,
    ConditionalModule.register(),
    FeaturesModule,
    ToolsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
