import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Patterns } from '@app/enums';
import { CreateUserDto, UpdateUserDto } from '@app/types';

import { UsersService } from './users.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  @MessagePattern(Patterns.CREATE_USER)
  async createUser(@Payload() data: CreateUserDto) {
    const createdUser = await this.usersService.createUser(data);

    this.logger.log('Created user:', createdUser);
    await this.rabbitmqService.sendProxyNotification(
      Patterns.CREATE_USER_SUCCESS,
      createdUser,
    );
  }

  @MessagePattern(Patterns.UPDATE_USER)
  async updateUser(@Payload() data: UpdateUserDto & { userId: number }) {
    const updatedUser = await this.usersService.updateUser(data.userId, {
      name: data.name,
      email: data.email,
    });

    this.logger.log('Updated user:', updatedUser);
    await this.rabbitmqService.sendProxyNotification(
      Patterns.UPDATE_USER_SUCCESS,
      updatedUser,
    );
  }
}
