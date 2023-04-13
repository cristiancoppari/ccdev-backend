import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as csruf from 'tiny-csrf';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

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

    app.use(cookieParser('bojackhorseman'));
    app.use(
        session({
            secret: 'mrpeanutbutterhouse',
        }),
    );
    app.use(csruf('12345678123456781234567812345678'));
    app.use(helmet());
    app.enableCors();

    await app.listen(process.env.PORT || 3001);
}
bootstrap();
