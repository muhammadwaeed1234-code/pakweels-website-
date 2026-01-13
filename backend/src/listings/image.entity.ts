import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Listing } from './listing.entity';

@Entity('images')
export class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column({ default: false })
    isCover: boolean;

    @ManyToOne(() => Listing, (listing) => listing.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'listingId' })
    listing: Listing;

    @Column()
    listingId: string;
}
