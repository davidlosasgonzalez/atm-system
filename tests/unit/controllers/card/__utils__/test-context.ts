import { Test, TestingModule } from '@nestjs/testing';
import { AccountCardController } from '@/modules/card/account-card.controller';
import { CardController } from '@/modules/card/card.controller';
import { CardService } from '@/modules/card/card.service';
import { Card } from '@/modules/card/entities/card.entity';
import { Account } from '@/modules/account/entities/account.entity';
import { CreateCardDto } from '@/modules/card/dto/create-card.dto';
import { ActivateCardDto } from '@/modules/card/dto/activate-card.dto';
import { ChangeCardPinDto } from '@/modules/card/dto/change-card-pin.dto';

export function setupCardControllerTestContext() {
    let accountCardController: AccountCardController;
    let cardController: CardController;
    let cardService: jest.Mocked<CardService>;

    const fakeCard: Card = {
        id: 'card-id',
        accountId: 'account-id',
        account: {} as Account,
        number: '4111111111111111',
        pin: null,
        isActive: false,
        cardType: 'debit',
        withdrawalLimit: 1000,
        creditLimit: 0,
        createdAt: new Date(),
    };

    const createCardDto: CreateCardDto = { cardType: 'debit' };
    const activateCardDto: ActivateCardDto = {
        pin: '1234',
        repeatedPin: '1234',
    };
    const changeCardPinDto: ChangeCardPinDto = {
        currentPin: '1234',
        newPin: '5678',
        repeatedNewPin: '5678',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccountCardController, CardController],
            providers: [
                {
                    provide: CardService,
                    useValue: {
                        create: jest.fn(),
                        activate: jest.fn(),
                        changeCardPin: jest.fn(),
                    },
                },
            ],
        }).compile();

        accountCardController = module.get(AccountCardController);
        cardController = module.get(CardController);
        cardService = module.get(CardService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    return () => ({
        accountCardController,
        cardController,
        cardService,
        fakeCard,
        createCardDto,
        activateCardDto,
        changeCardPinDto,
    });
}
