import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenCC } from 'creditcard-generator';
import { Repository } from 'typeorm';
import { ActivateCardDto } from './dto/activate-card.dto';
import { ChangeCardPinDto } from './dto/change-card-pin.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './entities/card.entity';
import { HashingService } from './services/hashing-service';
import { GenCCFn } from './types/gencc.type';
import { Account } from '../account/entities/account.entity';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private readonly cardRepo: Repository<Card>,
        @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
        private readonly hashingService: HashingService,
    ) {}

    public async create(
        createCardDto: CreateCardDto,
        accountId: string,
    ): Promise<Card> {
        await this.ensureAccountExists(accountId);

        const [number]: string[] = (GenCC as GenCCFn)('VISA', 1);

        const card: Card = this.cardRepo.create({
            accountId,
            number,
            pin: null,
            isActive: false,
            cardType: createCardDto.cardType,
            withdrawalLimit: 1000,
            creditLimit: createCardDto.cardType === 'credit' ? 3000 : 0,
        });

        return this.cardRepo.save(card);
    }

    public async activate(
        activateCardDto: ActivateCardDto,
        cardId: string,
    ): Promise<void> {
        const card: Card = await this.getCardOrThrow(cardId);

        if (card.isActive) {
            throw new BadRequestException('La tarjeta ya está activada');
        }

        card.pin = await this.hashingService.hash(activateCardDto.pin);
        card.isActive = true;

        await this.cardRepo.save(card);
    }

    public async changeCardPin(
        changeCardPinDto: ChangeCardPinDto,
        cardId: string,
    ): Promise<void> {
        const card: Card = await this.getCardOrThrow(cardId);

        if (!card.isActive) {
            throw new BadRequestException(
                'La tarjeta debe estar activa para poder cambiar el PIN.',
            );
        }

        if (!card.pin) {
            throw new BadRequestException(
                'La tarjeta aún no tiene PIN configurado.',
            );
        }

        const isSame: boolean = await this.hashingService.compare(
            changeCardPinDto.newPin,
            card.pin,
        );

        if (isSame) {
            throw new BadRequestException(
                'El nuevo PIN no puede ser igual al PIN actual.',
            );
        }

        const isMatch: boolean = await this.hashingService.compare(
            changeCardPinDto.currentPin,
            card.pin,
        );

        if (!isMatch) {
            throw new BadRequestException('El PIN actual es incorrecto.');
        }

        card.pin = await this.hashingService.hash(changeCardPinDto.newPin);

        await this.cardRepo.save(card);
    }

    private async ensureAccountExists(accountId: string): Promise<void> {
        const exists: boolean = await this.accountRepo
            .createQueryBuilder()
            .select('1')
            .where('id = :accountId', { accountId })
            .getExists();

        if (!exists) {
            throw new NotFoundException('Cuenta no encontrada');
        }
    }

    private async getCardOrThrow(cardId: string): Promise<Card> {
        const card: Card | null = await this.cardRepo.findOneBy({ id: cardId });

        if (!card) {
            throw new NotFoundException('Tarjeta no encontrada');
        }

        return card;
    }
}
