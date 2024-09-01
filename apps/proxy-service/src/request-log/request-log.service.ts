import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestLog } from '@app/entities/request-log.entity';

@Injectable()
export class RequestLogService {
  constructor(
    @InjectRepository(RequestLog)
    private requestLogRepository: Repository<RequestLog>,
  ) {}

  async logRequest(log: Partial<RequestLog>): Promise<void> {
    await this.requestLogRepository.save(log);
  }
}
