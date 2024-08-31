import { Test, TestingModule } from '@nestjs/testing';
import { WriteApiController } from './write-api.controller';
import { WriteApiService } from './write-api.service';

describe('WriteApiController', () => {
  let writeApiController: WriteApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WriteApiController],
      providers: [WriteApiService],
    }).compile();

    writeApiController = app.get<WriteApiController>(WriteApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(writeApiController.getHello()).toBe('Hello World!');
    });
  });
});
