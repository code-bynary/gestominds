import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AuthRepository } from '../repositories/auth.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '15m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export class AuthService {
    static async hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    static async comparePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }

    static generateTokens(userId: string) {
        const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
        const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN as any });
        return { accessToken, refreshToken };
    }

    static async register(data: any) {
        const { name, email, password } = data;

        // Check if user exists
        const existing = await AuthRepository.findUserByEmail(email);
        if (existing) throw new Error('Email already in use');

        const passwordHash = await this.hashPassword(password);
        const { user, tenant } = await AuthRepository.createUserWithTenant({ name, email, passwordHash });

        const tokens = this.generateTokens(user.id);

        return {
            user: { id: user.id, name: user.name, email: user.email },
            tenant: { id: tenant.id, name: tenant.name },
            ...tokens
        };
    }

    static async login(data: any) {
        const { email, password } = data;
        const user = await AuthRepository.findUserByEmail(email);

        if (!user || !(await this.comparePassword(password, user.password))) {
            throw new Error('Invalid credentials');
        }

        const tokens = this.generateTokens(user.id);
        const activeTenant = user.tenants[0]?.tenant;

        return {
            user: { id: user.id, name: user.name, email: user.email },
            tenant: activeTenant ? { id: activeTenant.id, name: activeTenant.name } : null,
            ...tokens
        };
    }
}
