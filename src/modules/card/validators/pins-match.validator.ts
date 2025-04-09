import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'PinsMatch', async: false })
export class PinsMatchConstraint implements ValidatorConstraintInterface {
    validate(repeatedPin: string, args: ValidationArguments): boolean {
        const { pin } = args.object as { pin: string; repeatedPin: string };
        return repeatedPin === pin;
    }

    defaultMessage(): string {
        return 'Los PIN introducidos no coinciden.';
    }
}
