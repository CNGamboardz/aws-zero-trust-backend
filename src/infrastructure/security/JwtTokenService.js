import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import TokenService from '../../domain/ports/TokenService.js';

export default class JwtTokenService extends TokenService {
  sign(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: 'aws-zero-trust-backend',
      audience: 'aws-zero-trust-frontend',
      algorithm: 'HS256',
    });
  }

  verify(token) {
    return jwt.verify(token, env.JWT_SECRET, {
      issuer: 'aws-zero-trust-backend',
      audience: 'aws-zero-trust-frontend',
      algorithms: ['HS256'],
    });
  }
}
