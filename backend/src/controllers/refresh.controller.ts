import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

export class RefreshController {
    static async refresh(req: any, res: any) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        try {
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };
            const tokens = AuthService.generateTokens(decoded.userId);
            res.json(tokens);
        } catch (err) {
            res.status(401).json({ error: 'Invalid refresh token' });
        }
    }
}
