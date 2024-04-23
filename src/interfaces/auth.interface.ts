import { Request } from 'express'

export interface JwtTokenData {
  id: string
  source: string
  isOnChain: string
}

export interface TokenData {
  token: string
  expiresIn: number
}

export interface RequestWithUser extends Request {
  user: string
}
