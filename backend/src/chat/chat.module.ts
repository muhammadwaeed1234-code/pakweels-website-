import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Conversation, Message])],
    controllers: [ChatController],
    providers: [ChatService],
    exports: [ChatService],
})
export class ChatModule { }
