import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
    private readonly saltRounds: number = 10;

    public async hash(value: string): Promise<string> {
        return bcrypt.hash(value, this.saltRounds);
    }

    public async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}
