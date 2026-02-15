import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SALT_ROUNDS = 10

export type UserRole = 'CUSTOMER' | 'ARTIST' | 'MARKETER'

export interface UserPayload {
  id: string
  email: string
  name?: string
  country?: string
  role: UserRole
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: UserPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload
  } catch {
    return null
  }
}

export function generateAffiliateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'MRKT-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function isCustomer(user: UserPayload): boolean {
  return user.role === 'CUSTOMER'
}

export function isArtist(user: UserPayload): boolean {
  return user.role === 'ARTIST'
}

export function isMarketer(user: UserPayload): boolean {
  return user.role === 'MARKETER'
}