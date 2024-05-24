import { Request } from 'express';
import { auth } from '../../helpers/utility/firebaseAdmin';
import { UserRepository } from '../../data-access/repositories/user.repository';
import { UserAttributes } from '../../infrastructure/models/user.model';
import { Model } from 'sequelize';
import { BaseService } from '../common/base.service';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { UserInputDTO, UserResultDTO, UserUpdateDTO } from '../../helpers/dtos/user.dto';
import { RoleRepository } from '../../data-access/repositories/role.repository';
import { getMessage, formatMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class UserService extends BaseService<Model<UserAttributes>> {
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;

  constructor() {
    super(new UserRepository());
    this.userRepository = new UserRepository();
    this.roleRepository = new RoleRepository();
  }

  async register(req: Request, data: UserInputDTO): Promise<UserResultDTO> {
    const { email, password, name, address } = data;

    if (!this.isValidPassword(password)) {
      throw new Error(getMessage(req, MessagesKey.INVALIDPASSWORD));
    }

    const userRecord = await auth.createUser({ email, password });

    const customerRole = await this.roleRepository.where(req, { name: 'customer' });
    if (!customerRole || customerRole.length === 0) {
      throw new Error(getMessage(req, MessagesKey.CUSTOMERROLENOTFOUND));
    }
    const rolePkid = customerRole[0].get('pkid') as number;

    const user: UserAttributes = {
      pkid: 0,
      uuid: userRecord.uid,
      role_pkid: rolePkid,
      name,
      address,
      image_profile: null,
    };

    const createdUser = await this.userRepository.create(req, user) as Model<UserAttributes>;
    return createdUser.toJSON();
  }

  async login(req: Request, data: { email: string; password: string }) {
    const { email } = data;
    const userRecord = await admin.auth().getUserByEmail(email);
    return await auth.createCustomToken(userRecord.uid);
  }

  async updateUser(req: Request, pkid: number, data: UserUpdateDTO) {
    return await this.userRepository.update(req, pkid, data);
  }

  async getUserDataFromFirebase(req: Request) {
    const user = (req as any).user;
    if (!user) {
      throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
    }
    return await auth.getUser(user.uid);
  }

  async resetPassword(req: Request, email: string) {
    await auth.getUserByEmail(email);
    return await auth.generatePasswordResetLink(email);
  }

  async uploadProfileImage(req: Request): Promise<UserResultDTO> {
    const user = (req as any).user;
    if (!user) {
      throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
    }

    if (!req.file) {
      throw new Error(getMessage(req, MessagesKey.NOFILEUPLOADED));
    }

    const userId = user.uid;
    const userRecord = await this.userRepository.findByID(req, userId) as Model<UserAttributes>;

    if (!userRecord) {
      throw new Error(formatMessage(getMessage(req, MessagesKey.SPESIFICDATANOTFOUND), ['User']));
    }

    const userJson = userRecord.toJSON() as UserAttributes;
    const { name, role_pkid } = userJson;
    const extension = path.extname(req.file.originalname);
    const fileName = `${name}-${role_pkid}-${userId}${extension}`;
    const filePath = path.resolve(__dirname, '../../helpers/assets/image-profiles', fileName);

    if (userJson.image_profile) {
      const oldImagePath = path.resolve(__dirname, '../../helpers/assets/image-profiles', userJson.image_profile);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    fs.writeFileSync(filePath, req.file.buffer);
    userJson.image_profile = fileName;

    await this.userRepository.update(req, userJson.pkid, { image_profile: fileName });

    return userJson as UserResultDTO;
  }

  private isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
}
