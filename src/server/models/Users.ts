import bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';

import { Signup } from '@/common/dto/auth';

/**
 * Model representing the basic operations done on the User object
 */
export default class Users {
  constructor(private readonly prismaUser: PrismaClient['user']) {}

  /**
   * Register a user
   * @param login
   * @param password
   */
  async register({ login, password }: Signup): Promise<User> {
    const exists = await this.prismaUser.findFirst({
      where: {
        login,
      },
    });
    if (exists) {
      throw new Error('Email already in use');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return this.prismaUser.create({
      data: {
        login,
        password: hash,
      },
    });
  }

  /**
   * Login a user
   * @param login
   * @param password
   */
  async login({ login, password }: Signup): Promise<User> {
    const user = await this.prismaUser.findFirst({
      where: {
        login,
      },
    });

    if (!user) {
      throw new Error(`No user found for login "${login}"`);
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new Error('Incorrect password');
    }

    return user;
  }
}
