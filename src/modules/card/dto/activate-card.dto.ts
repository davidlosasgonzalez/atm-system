import {
    Matches,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'PinsMatch', async: false })
class PinsMatchConstraint implements ValidatorConstraintInterface {
    validate(repeatedPin: string, args: ValidationArguments) {
        const { pin } = args.object as { pin: string; repeatedPin: string };
        return repeatedPin === pin;
    }

    defaultMessage(): string {
        return 'Los PIN introducidos no coinciden.';
    }
}

export class ActivateCardDto {
    @Matches(/^\d{4}$/, {
        message: 'El PIN debe contener exactamente 4 dígitos numéricos.',
    })
    pin!: string;

    @Matches(/^\d{4}$/, {
        message: 'El PIN debe contener exactamente 4 dígitos numéricos.',
    })
    @Validate(PinsMatchConstraint)
    repeatedPin!: string;
}
