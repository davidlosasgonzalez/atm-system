import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
    async hash(value: string) {
        return bcrypt.hash(value, 10);
    }

    async compare(plain: string, hash: string) {
        return bcrypt.compare(plain, hash);
    }
}
