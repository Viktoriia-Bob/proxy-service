import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Patterns } from '@app/enums';

import { UsersService } from './users.service';
import { UserFilterDto } from '@app/types';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(Patterns.READ_USERS)
  async getAllUsers(
    @Payload()
    { pageNumber, filter }: { pageNumber?: number; filter?: UserFilterDto },
  ) {
    const result = await this.usersService.findAll(pageNumber, filter);

    this.logger.log('Get all users:', result);
  }
}
