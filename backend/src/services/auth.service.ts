import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { config } from '../config/env.js';
import { isDbAvailable, dbQuery } from '../config/database.js';
import { User, SafeUser, UserRole, TokenPayload } from '../models/user.model.js';
import { mockStore } from './mockData.store.js';
import { AppError } from '../middleware/errorHandler.js';

export interface RegisterDTO {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
  department?: string;
}

export interface LoginResult {
  token: string;
  user: SafeUser;
}

export class AuthService {
  async register(data: RegisterDTO): Promise<LoginResult> {
    const emailNormalized = data.email.toLowerCase().trim();
    const existingUser = await this.findByEmail(emailNormalized);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const role: UserRole = data.role || 'VIEWER';
    const department = data.department || 'General Administration';

    let createdUser: User;

    if (isDbAvailable()) {
      const sql = `
        INSERT INTO users (id, email, password_hash, full_name, role, department)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, password_hash, full_name, role, department, created_at, updated_at
      `;
      const res = await dbQuery<User>(sql, [id, emailNormalized, password_hash, data.full_name, role, department]);
      createdUser = res.rows[0];
    } else {
      createdUser = {
        id,
        email: emailNormalized,
        password_hash,
        full_name: data.full_name,
        role,
        department,
        created_at: new Date()
      };
      mockStore.users.push(createdUser);
    }

    const token = this.generateToken(createdUser);
    return {
      token,
      user: this.toSafeUser(createdUser)
    };
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const emailNormalized = email.toLowerCase().trim();
    const user = await this.findByEmail(emailNormalized);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user);
    return {
      token,
      user: this.toSafeUser(user)
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const emailNormalized = email.toLowerCase().trim();
    if (isDbAvailable()) {
      const res = await dbQuery<User>('SELECT * FROM users WHERE email = $1 LIMIT 1', [emailNormalized]);
      return res.rows[0] || null;
    } else {
      const found = mockStore.users.find(u => u.email.toLowerCase() === emailNormalized);
      return found || null;
    }
  }

  private generateToken(user: User): string {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn']
    });
  }

  private toSafeUser(user: User): SafeUser {
    const { password_hash, ...safe } = user;
    return safe;
  }
}

export const authService = new AuthService();
