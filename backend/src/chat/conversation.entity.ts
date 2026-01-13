import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'buyerId' })
    buyer: User;

    @Column()
    buyerId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sellerId' })
    seller: User;

    @Column()
    sellerId: string;

    @ManyToOne(() => Listing, { nullable: true })
    @JoinColumn({ name: 'listingId' })
    listing: Listing;

    @Column({ nullable: true })
    listingId: string;

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
