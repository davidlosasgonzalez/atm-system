import {
    Matches,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'NewPinsMatch', async: false })
class NewPinsMatchConstraint implements ValidatorConstraintInterface {
    validate(repeatedNewPin: string, args: ValidationArguments) {
        const { newPin } = args.object as {
            newPin: string;
            repeatedNewPin: string;
        };
        return repeatedNewPin === newPin;
    }

    defaultMessage(): string {
        return 'Los nuevos PIN introducidos no coinciden.';
    }
}

export class ChangeCardPinDto {
    @Matches(/^\d{4}$/, {
        message: 'El PIN actual debe contener exactamente 4 dígitos numéricos.',
    })
    currentPin!: string;

    @Matches(/^\d{4}$/, {
        message: 'El nuevo PIN debe contener exactamente 4 dígitos numéricos.',
    })
    newPin!: string;

    @Matches(/^\d{4}$/, {
        message: 'El nuevo PIN debe contener exactamente 4 dígitos numéricos.',
    })
    @Validate(NewPinsMatchConstraint)
    repeatedNewPin!: string;
}
