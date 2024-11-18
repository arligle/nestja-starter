import {
  Body,
  Controller,
  Delete,
  Get,
  Optional,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  // Req,
  UseGuards,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { MailerService } from '@nestjs-modules/mailer';
// import { AuthGuard } from '@nestjs/passport';
// import { AdminGuard } from '@/common/guards/admin.guard';
// import { JwtGuard } from '@/common/guards/jwt.guard';
import {
  Permission,
  Read,
} from '@/common/decorators/role-permission.decorator';
import { RolePermissionGuard } from '@/common/guards/role-permission.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Serialize } from '@/common/decorators/serialize.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUpdateUserDto } from './dto/public-update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PolicyGuard } from '@/common/guards/policy.guard';
import { PublicUserDto } from './dto/public-user.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RolePermissionGuard, PolicyGuard)
@Permission('user')
export class UserController {
  constructor(
    @Optional() private userRepository: UserRepository,
    @Optional() private readonly mailerService: MailerService,
  ) {}

  @Post()
  @Serialize(PublicUserDto)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  @Get()
  @Read()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page,
    @Query('limit', new ParseIntPipe({ optional: true })) limit,
  ) {
    return this.userRepository.findAll(page, limit);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.userRepository.findOne(username);
  }

  @Patch()
  @Serialize(PublicUpdateUserDto)
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userRepository.delete(id);
  }
}
