import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'NewPinsMatch', async: false })
export class NewPinsMatchConstraint implements ValidatorConstraintInterface {
    validate(repeatedNewPin: string, args: ValidationArguments): boolean {
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
