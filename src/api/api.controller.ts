import { Controller, Post, Req, Res, Body, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { BodyDto } from './dto/body.dto';
import { IRequestWithCsrfToken } from './interfaces/interfaces';

@Controller('api')
export class ApiController {
    constructor(private apiService: ApiService) {}

    @Get('csrf')
    getCsrfToken(@Req() req: IRequestWithCsrfToken, @Res() res: Response) {
        req.csrfToken();
        return res.status(200).send('token generated');
    }

    @Post('send-mail')
    @ApiResponse({ status: 200, description: 'Email sent succesfully' })
    @ApiResponse({ status: 400, description: 'Bad request. Some emails were rejected.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async sendMail(@Res() res: Response, @Body() BodyDataDto: BodyDto) {
        try {
            const emailPromises = await this.apiService.sendMail(BodyDataDto);
            await Promise.all(emailPromises);
            return res.status(200).send({ message: 'Email sent succesfully' });
        } catch (error) {
            console.error('Error');
            return res.status(500).send({ message: 'Internal server error' });
        }
    }
}
