import { Request } from 'express';
import { auth } from '../../helpers/utility/firebaseAdmin';
import { UserRepository } from '../../data-access/repositories/user.repository';
import { UserAttributes } from '../../infrastructure/models/user.model';
import { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { BaseService } from '../common/base.service';
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import { UserInputDTO, UserResultDTO, UserUpdateDTO } from '../../helpers/dtos/user.dto';
import { RoleRepository } from '../../data-access/repositories/role.repository';
import { formatMessage, getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { UserResultVM, UserUpdateVM } from '../../helpers/view-models/user.vm';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

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

  private async isEmailUnique(req: Request, email: string): Promise<boolean> {
    const existingUser = await this.userRepository.whereExisting(req, {
      email,
    });
    return !existingUser;
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

    if (!(await this.isEmailUnique(req, email))) {
      throw new Error(getMessage(req, MessagesKey.EMAILALREADYEXISTS));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password: hashedPassword,
      });
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.ERRORCREATEUSER));
    }

    const customerRole = await this.roleRepository.findByName('customer');
    if (!customerRole) {
      await auth.deleteUser(userRecord.uid);
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

    let createdUser;
    try {
      createdUser = await this.userRepository.create(req, user);
    } catch (error) {
      await auth.deleteUser(userRecord.uid);
      throw new Error(getMessage(req, MessagesKey.ERRORCREATE));
    }

    return createdUser.toJSON();
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

      return jwt.sign({ uid: userRecord.uid }, JWT_SECRET, { expiresIn: '5d' });
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.INVALIDCREDENTIALS));
    }
  }
  //endregion

  //region CRUD methods
  public async findByIdUser(req: Request, pkid: number): Promise<UserResultDTO> {
    const user = await this.userRepository.findByID(req, pkid);
    if (!user) {
      throw new Error(getMessage(req, MessagesKey.USERNOTFOUND));
    }
    return user.toJSON();
  }

  public async findAllUser(req: Request): Promise<UserResultDTO[]> {
    const user = (req as any).user;
    if (!user) {
      throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
    }

    const localUser = await this.userRepository.findByUUID(user.uid);
    if (!localUser) {
      throw new Error(getMessage(req, MessagesKey.USERNOTFOUND));
    }

    const rolePkid = localUser.get('role_pkid');
    const adminRole = await this.roleRepository.findByName('admin');

    if (rolePkid !== adminRole?.get('pkid')) {
      throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
    }

    const users = await this.userRepository.findAll(req);
    return users.map(user => user.toJSON() as UserResultDTO);
  }

  async updateUser(
    req: Request,
    pkid: number,
    data: UserUpdateDTO,
  ): Promise<UserResultDTO> {
    const userUpdateVM = new UserUpdateVM(data);
    const [numberOfAffectedRows] =
      await this.userRepository.update(req, pkid, userUpdateVM.userData);
    if (numberOfAffectedRows === 0) {
      throw new Error(getMessage(req, MessagesKey.USERUPDATENOTFOUND));
    }

    const updatedUser = await this.userRepository.findByID(req, pkid);
    if (!updatedUser) {
      throw new Error(getMessage(req, MessagesKey.USERNOTFOUND));
    }

    return new UserResultVM(updatedUser.toJSON()).result;
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
