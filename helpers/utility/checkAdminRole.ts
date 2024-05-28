import { Request } from 'express';
import { UserRepository } from '../../data-access/repositories/user.repository';
import { RoleRepository } from '../../data-access/repositories/role.repository';
import { getMessage } from '../messages/messagesUtil';
import { MessagesKey } from '../messages/messagesKey';

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

export const checkAdminRole = async (req: Request): Promise<void> => {
  const user = (req as any).user;
  if (!user) {
    throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
  }

  const localUser = await userRepository.findByUUID(user.uid);
  if (!localUser) {
    throw new Error(getMessage(req, MessagesKey.USERNOTFOUND));
  }

  const rolePkid = localUser.get('role_pkid');
  const adminRole = await roleRepository.findByName('admin');

  if (rolePkid !== adminRole?.get('pkid')) {
    throw new Error(getMessage(req, MessagesKey.UNAUTHORIZED));
  }
};
