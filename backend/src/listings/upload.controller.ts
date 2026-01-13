import { Controller, Post, UseInterceptors, UploadedFile, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ListingsService } from './listings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('uploads')
export class UploadController {
    constructor(private listingsService: ListingsService) { }

    @Post(':listingId')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }))
    async uploadFile(@Param('listingId') listingId: string, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is invalid');
        }
        const imageUrl = `/uploads/${file.filename}`;
        return this.listingsService.saveImage(listingId, imageUrl);
    }
}
