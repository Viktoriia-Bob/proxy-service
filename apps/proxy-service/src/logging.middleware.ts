import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { RequestLogService } from './request-log/request-log.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly requestLogService: RequestLogService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, url, headers, body } = req;
    await this.requestLogService.logRequest({
      method,
      url,
      headers: JSON.stringify(headers),
      body: JSON.stringify(body),
    });
    next();
  }
}
