import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepo: Repository<Conversation>,
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,
    ) { }

    async findOrCreateConversation(buyerId: string, sellerId: string, listingId?: string): Promise<Conversation> {
        // Check if exists
        let conversation = await this.conversationRepo.findOne({
            where: { buyerId, sellerId, listingId },
        });

        if (!conversation) {
            conversation = this.conversationRepo.create({
                buyerId,
                sellerId,
                listingId,
            });
            await this.conversationRepo.save(conversation);
        }

        return conversation;
    }

    async getUserConversations(userId: string): Promise<Conversation[]> {
        return this.conversationRepo.find({
            where: [
                { buyerId: userId },
                { sellerId: userId },
            ],
            relations: ['buyer', 'seller', 'listing', 'messages'],
            order: { updatedAt: 'DESC' },
        });
    }

    async getMessages(conversationId: string): Promise<Message[]> {
        return this.messageRepo.find({
            where: { conversationId },
            order: { createdAt: 'ASC' },
            relations: ['sender'],
        });
    }

    async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
        const message = this.messageRepo.create({
            conversationId,
            senderId,
            content,
        });

        await this.messageRepo.save(message);

        // Update conversation timestamp
        await this.conversationRepo.update(conversationId, { updatedAt: new Date() });

        return message;
    }
}
