import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

interface CustomParseIntPipeOptions {
  optional?: boolean;
}

@Injectable()
export class CustomParseIntPipe implements PipeTransform {
  constructor(private options?: CustomParseIntPipeOptions) {}
  transform(value: any) {
    if (this.options && this.options.optional && !value) {
      return undefined;
    }

    const val = parseInt(value, 10);

    if (isNaN(val) || (val !== -1 && val < 0)) {
      throw new BadRequestException('参数不合法');
    }

    return value;
  }
}
