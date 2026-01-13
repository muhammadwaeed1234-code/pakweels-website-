import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from './listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { Image } from './image.entity';

@Injectable()
export class ListingsService {
    constructor(
        @InjectRepository(Listing)
        private listingsRepository: Repository<Listing>,
        @InjectRepository(Image)
        private imagesRepository: Repository<Image>,
    ) { }

    async create(createListingDto: CreateListingDto, userId: string): Promise<Listing> {
        const slug = this.generateSlug(createListingDto.title);
        const listing = this.listingsRepository.create({
            ...createListingDto,
            userId,
            slug,
            status: ListingStatus.PENDING, // Enforce Admin Approval
        });
        return this.listingsRepository.save(listing);
    }

    async findAll(query: any): Promise<Listing[]> {
        const qb = this.listingsRepository.createQueryBuilder('listing');
        qb.leftJoinAndSelect('listing.images', 'image');
        qb.where('listing.status = :status', { status: ListingStatus.ACTIVE });

        if (query.make) {
            qb.andWhere('LOWER(listing.make) LIKE :make', { make: `%${query.make.toLowerCase()}%` });
        }
        if (query.city) {
            qb.andWhere('listing.city = :city', { city: query.city });
        }
        if (query.minPrice) {
            qb.andWhere('listing.price >= :minPrice', { minPrice: query.minPrice });
        }
        if (query.maxPrice) {
            qb.andWhere('listing.price <= :maxPrice', { maxPrice: query.maxPrice });
        }
        if (query.minYear) {
            qb.andWhere('listing.year >= :minYear', { minYear: query.minYear });
        }
        if (query.maxYear) {
            qb.andWhere('listing.year <= :maxYear', { maxYear: query.maxYear });
        }

        qb.orderBy('listing.createdAt', 'DESC');
        return qb.getMany();
    }

    async findPending(): Promise<Listing[]> {
        return this.listingsRepository.find({
            where: { status: ListingStatus.PENDING },
            order: { createdAt: 'DESC' },
            relations: ['images', 'user']
        });
    }

    async findOne(slug: string): Promise<Listing | null> {
        return this.listingsRepository.findOne({
            where: { slug },
            relations: ['images', 'user']
        });
    }

    async updateStatus(id: string, status: ListingStatus): Promise<Listing> {
        const listing = await this.listingsRepository.findOne({ where: { id } });
        if (!listing) return null;
        listing.status = status;
        return this.listingsRepository.save(listing);
    }

    async saveImage(listingId: string, url: string): Promise<Image> {
        const image = this.imagesRepository.create({
            listingId,
            url,
            isCover: false
        });
        return this.imagesRepository.save(image);
    }

    private generateSlug(title: string): string {
        return title.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
    }
}
