import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req) {
        // In a real app, UseGuards(LocalAuthGuard) would extract user
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            return { error: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }
}
