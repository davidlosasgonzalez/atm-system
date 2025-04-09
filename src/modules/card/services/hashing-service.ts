import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
    private readonly saltRounds = 10;

    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, this.saltRounds);
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}
