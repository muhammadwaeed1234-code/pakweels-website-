import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Image } from './image.entity';

export enum TransmissionType {
    MANUAL = 'MANUAL',
    AUTOMATIC = 'AUTOMATIC',
}

export enum FuelType {
    PETROL = 'PETROL',
    DIESEL = 'DIESEL',
    HYBRID = 'HYBRID',
    ELECTRIC = 'ELECTRIC',
}

export enum ListingStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    REJECTED = 'REJECTED',
}

@Entity('listings')
export class Listing {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ type: 'int' })
    price: number;

    @Column({ type: 'int' })
    year: number;

    @Column({ type: 'int' })
    mileage: number;

    @Column()
    city: string;

    @Column()
    make: string; // e.g. Toyota

    @Column()
    model: string; // e.g. Corolla

    @Column()
    engineCapacity: string; // e.g. 1800cc

    @Column({
        type: 'enum',
        enum: TransmissionType,
    })
    transmission: TransmissionType;

    @Column({
        type: 'enum',
        enum: FuelType,
    })
    fuel: FuelType;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column('simple-array', { nullable: true })
    features: string[]; // ['Sunroof', 'ABS']

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @OneToMany(() => Image, (image) => image.listing)
    images: Image[];

    @Column({
        type: 'enum',
        enum: ListingStatus,
        default: ListingStatus.PENDING,
    })
    status: ListingStatus;

    @Column({ default: false })
    isFeatured: boolean;

    @Column({ default: 0 })
    viewCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
