import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                role: user.role
            }
        };
    }

    async register(createUserDto: CreateUserDto) {
        // Check if user exists
        const existing = await this.usersService.findOneByEmail(createUserDto.email);
        if (existing) {
            throw new UnauthorizedException('Email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(createUserDto.password, salt);

        // Create User
        const user = await this.usersService.create({
            ...createUserDto,
            password: passwordHash // Pass the hash to the entity field (mapped in service usually, but for simplicity here)
        } as any);

        return this.login(user);
    }
}
