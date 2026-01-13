import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum UserRole {
    BUYER = 'BUYER',
    SELLER = 'SELLER',
    DEALER = 'DEALER',
    ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column()
    passwordHash: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.BUYER,
    })
    role: UserRole;

    @Column({ default: false })
    isVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
