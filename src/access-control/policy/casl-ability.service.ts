import {
  AbilityBuilder,
  AbilityTuple,
  buildMongoQueryMatcher,
  createMongoAbility,
  MatchConditions,
  MongoAbility,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import {
  allInterpreters,
  allParsingInstructions,
  MongoQuery,
} from '@ucast/mongo2js';

export interface IPolicy {
  type: number; //类型标识，0-json,1-mongo,2-function
  effect: 'can' | 'cannot'; // 判断逻辑字段
  action: string; //操作标识, CURD
  subject: string; //资源标识, Class类
  fields?: string[] | string; //字段
  conditions?: string | Record<string, any>; //查询条件
  args?: string[] | string; // 针对于函数场景的参数
}

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
type AbilityType = MongoAbility<AbilityTuple, MongoQuery> | AppAbility;

@Injectable()
export class CaslAbilityService {
  async buildAbility(polices: IPolicy[], args?: any) {
    const abilityArr: AbilityType[] = [];
    let ability: AbilityType;

    polices.forEach((policy) => {
      switch (policy.type) {
        case 0: // JSON
          ability = this.handleJsonType(policy);
          break;
        case 1: // Mongo
          ability = this.handleMongoType(policy);
          break;
        case 2: // Function
          ability = this.handleFunctionType(policy, args);
          break;
        default:
          ability = this.handleJsonType(policy);
          break;
      }
      abilityArr.push(ability);
    });
    return abilityArr;
  }

  determineAction(effect: string, builder: any) {
    return effect === 'can' ? builder.can : builder.cannet;
  }

  // 针对一般的场景
  // can('action', 'subject', 'fields', 'conditions)
  handleJsonType(policy: IPolicy) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    const action = this.determineAction(policy.effect, { can, cannot });

    const localArgs = [];
    if (policy.fields) {
      localArgs.push(policy.fields);
    }
    if (policy.conditions) {
      localArgs.push(
        typeof policy.conditions === 'object' && policy.conditions['data']
          ? policy.conditions['data']
          : policy.conditions,
      );
    }

    // subject -> class类的实例
    action(policy.action, policy.subject, ...localArgs);

    // action(policy.action, policy.subject, conditions);
    // action(policy.action, policy.subject, policy.fields);
    // action(policy.action, policy.subject, policy.fields, conditions);
    return build();
  }

  // 针对于Mongo查询场景
  handleMongoType(policy: IPolicy) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    const action = this.determineAction(policy.effect, { can, cannot });
    const conditionsMatcher = buildMongoQueryMatcher(
      allParsingInstructions,
      allInterpreters,
    );
    const localArgs = [];
    if (policy.fields) {
      localArgs.push(policy.fields);
    }
    if (policy.conditions) {
      localArgs.push(
        typeof policy.conditions === 'object' && policy.conditions['data']
          ? policy.conditions['data']
          : policy.conditions,
      );
    }

    // subject -> class类的实例
    action(policy.action, policy.subject, ...localArgs);

    return build({
      conditionsMatcher,
    });
  }

  // 针对于函数的场景
  handleFunctionType(policy: IPolicy, args?: any) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

    const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

    const action = this.determineAction(policy.effect, { can, cannot });

    let func;
    if (policy.args && policy.args.length > 0) {
      if (policy.conditions && policy.conditions['data']) {
        func = new Function(
          ...policy.args,
          'return ' + policy.conditions['data'],
        );
      } else {
        func = new Function('return ' + policy.conditions);
      }
    } else {
      func = new Function('return ' + policy.conditions);
    }

    action(policy.action, policy.subject, func(...args));

    return build({
      conditionsMatcher: lambdaMatcher,
    });
  }
}
