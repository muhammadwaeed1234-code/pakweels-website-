import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../users/user.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @Column()
    conversationId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column()
    senderId: string;

    @Column('text')
    content: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
