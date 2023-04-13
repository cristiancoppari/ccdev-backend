import { Request } from 'express';

export interface IRequestWithCsrfToken extends Request {
    csrfToken(): string;
}
