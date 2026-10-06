import bcrypt from 'bcryptjs';

export default class BcryptPasswordHasher {
  async compare(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }

  async hash(plainText) {
    return bcrypt.hash(plainText, 12);
  }
}
