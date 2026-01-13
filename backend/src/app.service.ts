import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Automobile Marketplace API is Running!';
    }
}
