import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ListingsModule } from './listings/listings.module';
import { Listing } from './listings/listing.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_DATABASE || 'pakwheels_pro',
            entities: [User],
            synchronize: true, // Only for dev! Auto-creates tables
        }),
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
