import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';
import { CaslAbilityService } from './casl-ability.service';

@Module({
  controllers: [PolicyController],
  providers: [PolicyService, CaslAbilityService],
  exports: [CaslAbilityService],
})
export class PolicyModule {}
