import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Patterns } from '@app/enums';

@Injectable()
export class RabbitmqService {
  constructor(@Inject('PROXY_SERVICE') private proxyClient: ClientProxy) {}

  async sendProxyNotification(pattern: Patterns, value: any) {
    return this.proxyClient.emit(pattern, value).toPromise();
  }
}
