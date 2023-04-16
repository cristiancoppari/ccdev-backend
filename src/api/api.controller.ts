import { Controller, Post, Req, Res, Body, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { Response } from 'express';
import { BodyDto } from './dto/body.dto';
import { IRequestWithCsrfToken } from './interfaces/interfaces';

@Controller('api')
export class ApiController {
    constructor(private apiService: ApiService) {}

    @Get('csrf')
    getCsrfToken(@Req() req: IRequestWithCsrfToken, @Res() res: Response) {
        return res.status(200).send({ csrfToken: req.csrfToken() });
    }

    @Post('send-mail')
    async sendMail(@Res() res: Response, @Body() BodyDataDto: BodyDto) {
        try {
            const emailPromises = await this.apiService.sendMail(BodyDataDto);
            await Promise.all(emailPromises);
            return res.status(200).send({ message: `Email sent to ${BodyDataDto.email} succesfully` });
        } catch (error) {
            console.error('Error');
            return res.status(500).send({ message: 'Internal server error', error });
        }
    }
}
