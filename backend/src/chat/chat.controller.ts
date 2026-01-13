import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('conversations')
    async startConversation(@Body() body: { sellerId: string; listingId?: string }, @Request() req) {
        return this.chatService.findOrCreateConversation(req.user.id, body.sellerId, body.listingId);
    }

    @Get('conversations')
    async getConversations(@Request() req) {
        return this.chatService.getUserConversations(req.user.id);
    }

    @Get('conversations/:id/messages')
    async getMessages(@Param('id') id: string, @Request() req) {
        // Add logic to verify user belongs to conversation if needed
        return this.chatService.getMessages(id);
    }

    @Post('conversations/:id/messages')
    async sendMessage(@Param('id') id: string, @Body() body: { content: string }, @Request() req) {
        return this.chatService.sendMessage(id, req.user.id, body.content);
    }
}
