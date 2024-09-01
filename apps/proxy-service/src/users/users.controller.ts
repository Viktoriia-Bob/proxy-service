import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateUserDto, UpdateUserDto, UserFilterDto } from '@app/types';
import { Patterns, SocketKeys } from '@app/enums';
import { User } from '@app/entities';

import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { SocketGateway } from '../socket/socket.gateway';

@Controller('users')
export class UsersController {
  constructor(
    private readonly rabbitService: RabbitmqService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @MessagePattern(Patterns.CREATE_USER_SUCCESS)
  async userCreated(@Payload() user: User) {
    this.socketGateway.sendNotification(SocketKeys.CREATED_USER, user);
  }

  @MessagePattern(Patterns.UPDATE_USER_SUCCESS)
  async userUpdated(@Payload() user: User) {
    this.socketGateway.sendNotification(SocketKeys.UPDATED_USER, user);
  }

  @Get()
  async getUsers(
    @Body() filter: UserFilterDto,
    @Query('page') pageNumber?: number,
  ) {
    return this.rabbitService.sendReadNotification(Patterns.READ_USERS, {
      pageNumber,
      filter,
    });
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.rabbitService.sendWriteNotification(
      Patterns.CREATE_USER,
      createUserDto,
    );
  }

  @Put(':userId')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId', ParseIntPipe) userId: string,
  ) {
    return this.rabbitService.sendWriteNotification(Patterns.UPDATE_USER, {
      userId,
      ...updateUserDto,
    });
  }
}
