import { Request } from 'express';
import { auth } from '../../helpers/utility/firebaseAdmin';
import { UserRepository } from '../../data-access/repositories/user.repository';
import { UserAttributes } from '../../infrastructure/models/user.model';
import { Model } from 'sequelize';
import { BaseService } from '../common/base.service';

export class UserService extends BaseService<Model<UserAttributes>> {
  private userRepository: UserRepository;

  constructor() {
    super(new UserRepository());
    this.userRepository = new UserRepository();
  }

  async updateUser(req: Request, pkid: number, data: Partial<UserAttributes>) {
    return await this.userRepository.update(req, pkid, data);
  }

  async getUserDataFromFirebase(req: Request) {
    const user = (req as any).user;
    if (!user) {
      throw new Error('Unauthorized');
    }
    const firebaseUser = await auth.getUser(user.uid);
    return firebaseUser;
  }

  async resetPassword(req: Request, email: string) {
    const user = await auth.getUserByEmail(email);
    const resetLink = await auth.generatePasswordResetLink(email);
    // Here you can send the reset link to the user via email
    return resetLink;
  }
}
