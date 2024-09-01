import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Patterns } from '@app/enums';

@Injectable()
export class RabbitmqService {
  constructor(
    @Inject('READ_SERVICE') private readClient: ClientProxy,
    @Inject('WRITE_SERVICE') private writeClient: ClientProxy,
  ) {}

  async sendReadNotification(pattern: Patterns, value: any) {
    return this.readClient.emit(pattern, value).toPromise();
  }

  async sendWriteNotification(pattern: Patterns, value: any) {
    return this.writeClient.emit(pattern, value).toPromise();
  }
}
