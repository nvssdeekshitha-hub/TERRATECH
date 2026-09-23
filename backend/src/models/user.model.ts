export type UserRole = 'ADMIN' | 'OFFICER' | 'POLICYMAKER' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  department?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export type SafeUser = Omit<User, 'password_hash'>;

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
}
