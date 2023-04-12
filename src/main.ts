import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('APi Docs')
        .setDescription('The API for CC dev')
        .setVersion('1.0')
        .addTag('example')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api-docs', app, document);

    app.use(helmet());

    await app.listen(3000);
}
bootstrap();
