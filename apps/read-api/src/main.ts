import { NestFactory } from '@nestjs/core';
import { ReadApiModule } from './read-api.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ReadApiModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_MQ_URL],
        queue: 'read',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
