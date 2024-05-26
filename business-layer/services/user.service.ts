import { Request } from 'express';
import { auth } from '../../helpers/utility/firebaseAdmin';
import { UserRepository } from '../../data-access/repositories/user.repository';
import { UserAttributes } from '../../infrastructure/models/user.model';
import { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { BaseService } from '../common/base.service';
import * as fs from 'fs';
import * as path from 'path';
import {
  UserInputDTO,
  UserResultDTO,
  UserUpdateDTO,
} from '../../helpers/dtos/user.dto';
import { RoleRepository } from '../../data-access/repositories/role.repository';
import { formatMessage, getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class UserService extends BaseService<Model<UserAttributes>> {
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;

  constructor() {
    super(new UserRepository());
    this.userRepository = new UserRepository();
    this.roleRepository = new RoleRepository();
  }

  //region Helper methods
  private isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  //endregion

  //region Authentication methods
  async register(req: Request, data: UserInputDTO): Promise<UserResultDTO> {
    const { email, password, name, address } = data;

    if (!this.isValidPassword(password)) {
      throw new Error(getMessage(req, MessagesKey.INVALIDPASSWORD));
    }

    if (!this.isValidEmail(email)) {
      throw new Error(getMessage(req, MessagesKey.INVALIDEMAIL));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRecord = await auth.createUser({
      email,
      password: hashedPassword,
    });

    const customerRole = await this.roleRepository.findByName('customer');
    if (!customerRole) {
      throw new Error(getMessage(req, MessagesKey.CUSTOMERROLENOTFOUND));
    }
    const rolePkid = customerRole.get('pkid') as number;

    const user: UserAttributes = {
      pkid: 0,
      uuid: userRecord.uid,
      role_pkid: rolePkid,
      email,
      password: hashedPassword,
      name,
      address,
      image_profile: null,
    };

    const createdUser = await this.userRepository.create(req, user);

    return createdUser.toJSON() as UserResultDTO;
  }

  async login(req: Request, data: { email: string; password: string }) {
    const { email, password } = data;

    try {
      const userRecord = await auth.getUserByEmail(email);
      const user = await this.userRepository.findByUUID(userRecord.uid);

      if (!user) {
        throw new Error(getMessage(req, MessagesKey.USERNOTFOUND));
      }

      const userPassword = user.getDataValue('password');
      const passwordMatch = await bcrypt.compare(password, userPassword);
      if (!passwordMatch) {
        throw new Error(getMessage(req, MessagesKey.INVALIDCREDENTIALS));
      }

      return await auth.createCustomToken(userRecord.uid);
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.INVALIDCREDENTIALS));
    }
  }
  //endregion

  //region CRUD methods
  async updateUser(
    req: Request,
    pkid: number,
    data: UserUpdateDTO,
  ): Promise<UserResultDTO> {
    const [numberOfAffectedRows, affectedRows] =
      await this.userRepository.update(req, pkid, data);
    if (numberOfAffectedRows === 0) {
      throw new Error(getMessage(req, MessagesKey.USERUPDATENOTFOUND));
    }
    const updatedUser = affectedRows[0];
    return updatedUser.toJSON() as UserResultDTO;
  }

  async getUserDataFromFirebase(req: Request): Promise<UserResultDTO> {
    const user = (req as any).user;
    if (!user) {
      throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
    }
    const firebaseUser = await auth.getUser(user.uid);
    const localUser = await this.userRepository.findByUUID(user.uid);
    if (!localUser) {
      throw new Error(getMessage(req, MessagesKey.USERNOTFOUND));
    }
    return { ...localUser.toJSON(), ...firebaseUser.toJSON() } as UserResultDTO;
  }

  async resetPassword(req: Request, email: string): Promise<string> {
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
    const userRecord = await this.userRepository.findByID(req, userId);

    if (!userRecord) {
      throw new Error(
        formatMessage(getMessage(req, MessagesKey.SPESIFICDATANOTFOUND), [
          'User',
        ]),
      );
    }

    const userJson = userRecord.toJSON() as UserAttributes;
    const { name, role_pkid } = userJson;
    const extension = path.extname(req.file.originalname);
    const fileName = `${name}-${role_pkid}-${userId}${extension}`;
    const filePath = path.resolve(
      __dirname,
      '../../helpers/assets/image-profiles',
      fileName,
    );

    if (userJson.image_profile) {
      const oldImagePath = path.resolve(
        __dirname,
        '../../helpers/assets/image-profiles',
        userJson.image_profile,
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    fs.writeFileSync(filePath, req.file.buffer);
    userJson.image_profile = fileName;

    await this.userRepository.update(req, userJson.pkid, {
      image_profile: fileName,
    });

    return userJson as UserResultDTO;
  }
  //endregion
}
