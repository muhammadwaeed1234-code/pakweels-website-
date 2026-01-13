import { Controller, Get, Post, Body, Query, UseGuards, Request, Param, NotFoundException } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ListingStatus } from './listing.entity';

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Body() createListingDto: CreateListingDto, @Request() req) {
        return this.listingsService.create(createListingDto, req.user.id);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.listingsService.findAll(query);
    }

    @Get('admin/pending')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    findPending() {
        return this.listingsService.findPending();
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        const listing = await this.listingsService.findOne(slug);
        if (!listing) {
            throw new NotFoundException('Listing not found');
        }
        return listing;
    }

    @Post(':id/approve')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async approveListing(@Param('id') id: string) {
        return this.listingsService.updateStatus(id, ListingStatus.ACTIVE);
    }

    @Post(':id/reject')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async rejectListing(@Param('id') id: string) {
        return this.listingsService.updateStatus(id, ListingStatus.REJECTED);
    }
}
