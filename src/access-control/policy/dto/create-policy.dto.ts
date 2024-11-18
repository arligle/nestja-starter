import { IsIn, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';

type FieldType = string | string[] | Record<string, any>;

export class CreatePolicyDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @ValidateIf((o) => !o.id)
  @IsInt()
  type: number;

  @ValidateIf((o) => !o.id)
  @IsString()
  @IsIn(['can', 'cannot'])
  effect: 'can' | 'cannot';

  @ValidateIf((o) => !o.id)
  @IsString()
  action: string;

  @ValidateIf((o) => !o.id)
  @IsString()
  subject: string;

  @ValidateIf((o) => !o.id)
  @IsOptional()
  fields?: FieldType;

  @ValidateIf((o) => !o.id)
  @IsOptional()
  conditions?: FieldType;

  @ValidateIf((o) => !o.id)
  @IsOptional()
  args?: FieldType;
}
