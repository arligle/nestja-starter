import { SetMetadata } from '@nestjs/common';
import { Action } from '../enum/actions.enum';
import { Reflector } from '@nestjs/core';

export const PERMISSION_KEY = 'permission';

const accumulateMetadata = (key: string, permission: string): any => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const reflector = new Reflector();
    // 针对于方法的 ->function
    if (descriptor && descriptor.value) {
      const existingPermissions = reflector.get(key, descriptor.value) || [];
      const newPermissions = [...existingPermissions, permission];
      SetMetadata(key, newPermissions)(target, propertyKey, descriptor);
    } else {
      // 针对于类的 ->constructor
      const existingPermissions = reflector.get(key, target) || [];
      const newPermissions = [...existingPermissions, permission];
      SetMetadata(key, newPermissions)(target);
    }
  };
};

export const Permission = (permission: string) =>
  accumulateMetadata(PERMISSION_KEY, permission);

export const Create = () =>
  accumulateMetadata(PERMISSION_KEY, Action.Create.toLocaleLowerCase());

export const Update = () =>
  accumulateMetadata(PERMISSION_KEY, Action.Update.toLocaleLowerCase());

export const Read = () =>
  accumulateMetadata(PERMISSION_KEY, Action.Read.toLocaleLowerCase());

export const Delete = () =>
  accumulateMetadata(PERMISSION_KEY, Action.Delete.toLocaleLowerCase());
