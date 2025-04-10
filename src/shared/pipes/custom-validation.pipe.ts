import {
    BadRequestException,
    ValidationPipe,
    ValidationError,
} from '@nestjs/common';

import { DataResponse } from '../types/base-response.type';
import { FormattedValidationError } from '../types/formatted-validation-error.type';

export const customValidationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[]): BadRequestException => {
        const errorList: FormattedValidationError[] = errors.map((err) => {
            const { property: field, constraints } = err;

            let message = 'Error de validación.';

            if (constraints) {
                const constraintMessages: string[] = Object.values(constraints);
                message = constraintMessages[0];

                if (message.includes('should not exist')) {
                    message = `La propiedad '${field}' no está permitida.`;
                }
            }

            return { field, message };
        });

        const responseBody: DataResponse<{
            errors: FormattedValidationError[];
        }> = {
            status: 'error',
            message: 'Validación fallida',
            data: {
                errors: errorList,
            },
        };

        return new BadRequestException(responseBody);
    },
});
