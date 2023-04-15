import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // app.use(helmet());
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.use(cookieParser());
    app.use(csurf({ cookie: { sameSite: true } }));

    await app.listen(process.env.PORT || 3001);
}
bootstrap();
