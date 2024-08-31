import { Test, TestingModule } from '@nestjs/testing';
import { ReadApiController } from './read-api.controller';
import { ReadApiService } from './read-api.service';

describe('ReadApiController', () => {
  let readApiController: ReadApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReadApiController],
      providers: [ReadApiService],
    }).compile();

    readApiController = app.get<ReadApiController>(ReadApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(readApiController.getHello()).toBe('Hello World!');
    });
  });
});
