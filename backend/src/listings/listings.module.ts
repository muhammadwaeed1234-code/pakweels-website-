import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { Listing } from './listing.entity';
import { Image } from './image.entity';
import { UploadController } from './upload.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Listing, Image])],
    controllers: [ListingsController, UploadController],
    providers: [ListingsService],
})
export class ListingsModule { }
