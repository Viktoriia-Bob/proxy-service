import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { SocketKeys } from '@app/enums';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer() server: Server;

  sendNotification(key: SocketKeys, value: any) {
    this.server.emit(key, value);
  }
}
