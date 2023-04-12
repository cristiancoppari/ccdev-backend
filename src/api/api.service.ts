import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';
import { BodyDto } from './dto/body.dto';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class ApiService {
    constructor(private configService: ConfigService) {}

    // TODO: Define a body object in a DTO
    async sendMail(BodyDataDto: BodyDto) {
        const OAUTH2_CLIENT_ID = this.configService.get<string>('OAUTH2_CLIENT_ID');
        const OAUTH2_CLIENT_SECRET = this.configService.get<string>('OAUTH2_CLIENT_SECRET');
        const OAUTH2_REFRESH_TOKEN = this.configService.get<string>('OAUTH2_REFRESH_TOKEN');
        const OAUTH2_REDIRECT_URI = this.configService.get<string>('OAUTH2_REDIRECT_URI');
        const EMAIL_SENDER = this.configService.get<string>('EMAIL_SENDER');

        const OAuth2Client: OAuth2Client = new google.auth.OAuth2(
            OAUTH2_CLIENT_ID,
            OAUTH2_CLIENT_SECRET,
            OAUTH2_REDIRECT_URI,
        );

        OAuth2Client.setCredentials({
            refresh_token: OAUTH2_REFRESH_TOKEN,
        });

        const accessToken: any = await OAuth2Client.getAccessToken();
        const transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: EMAIL_SENDER,
                clientId: OAUTH2_CLIENT_ID,
                clientSecret: OAUTH2_CLIENT_SECRET,
                refreshToken: OAUTH2_REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailDBOptions = {
            from: EMAIL_SENDER,
            to: EMAIL_SENDER,
            subject: 'New contact - CC DEV',
            html: `
                <h1>Contact Info</h1>
                <p>Name: ${BodyDataDto.name} ${BodyDataDto.last_name},</p>
                <p>Email: ${BodyDataDto.email}</p>
                <p>Message: ${BodyDataDto.message}</p>
            `,
        };

        const mailContactOptions = {
            from: `CC Dev - <${EMAIL_SENDER}>`,
            to: BodyDataDto.email,
            subject: 'Thank you for contacting us!',
            html: `
                <h1>Contact Info</h1>
                <p>Thank you for contacting us ${BodyDataDto.name} ${BodyDataDto.last_name},</p>
                <p>We will contact you as soon as possible at: ${BodyDataDto.email}.</p>
            `,
        };

        const resultDB: Promise<SMTPTransport.SentMessageInfo> = transport.sendMail(mailDBOptions);
        const resultContact: Promise<SMTPTransport.SentMessageInfo> = transport.sendMail(mailContactOptions);

        // Promise[]
        return [resultDB, resultContact];
    }
}
