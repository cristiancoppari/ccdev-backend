import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';

const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => 'mrpeanutbutterhousewhosthatdog',
    cookieName: 'csrfToken',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax', // Recommend you make this strict if posible
        path: '/',
        secure: true,
    },
});

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.enableCors({
        origin: process.env.CORS_PROD_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });
    app.use(cookieParser());
    app.use(doubleCsrfProtection);

    await app.listen(process.env.PORT || 3001);
}
bootstrap();

export { generateToken };
