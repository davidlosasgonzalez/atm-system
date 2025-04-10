import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponse } from '@/shared/types/base-response.type';
import { isHttpExceptionResponseWithData } from '@/shared/utils/is-http-exception-response-with-data';
import { isHttpExceptionResponseWithMessage } from '@/shared/utils/is-http-exception-response-with-message';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        console.log('[GLOBAL EXCEPTION CAUGHT]:', exception);

        const ctx = host.switchToHttp();
        const response: Response = ctx.getResponse();

        let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';
        let data: unknown;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();

            if (typeof res === 'string') {
                message = res;
            } else {
                if (isHttpExceptionResponseWithMessage(res)) {
                    message = res.message;
                }

                if (isHttpExceptionResponseWithData(res)) {
                    data = res.data;
                }
            }
        }

        const responseBody: BaseResponse | (BaseResponse & { data: unknown }) =
            {
                status: 'error',
                message,
                ...(data !== undefined && { data }),
            };

        response.status(status).json(responseBody);
    }
}
