import QB, {
  QBCreateUserWithLogin,
  QBCreateUserWithEmail,
  QBUser,
  ListUserResponse,
} from 'quickblox';

export const qbCreateUser = <T = QBCreateUserWithLogin | QBCreateUserWithEmail>(
  data: T,
) =>
  new Promise<QBUser>((resolve, reject) => {
    QB.users.create(data, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

export const qbGetUsersByTags = (
  tags: string | string[],
  config?: {
    page?: number;
    per_page?: number;
  },
) =>
  new Promise<ListUserResponse>((resolve, reject) => {
    QB.users.get(
      { tags: typeof tags === 'string' ? tags : tags.join(), ...config },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });

export const qbGetUsers = (filter: Dictionary<unknown>) =>
  new Promise<ListUserResponse>((resolve, reject) => {
    QB.users.listUsers({ filter }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

export const findUserById = async (userId: QBUser['id']) => {
  const userResult = await qbGetUsers({
    field: 'id',
    param: 'in',
    value: [userId],
  });

  const [userData] = userResult?.items || [];

  if (!userData?.user) {
    throw new Error('Error: User not found');
  }

  return userData.user;
};

export const qbUpdateUser = (
  userId: QBUser['id'],
  data: Partial<Omit<QBUser, 'id'>>,
) =>
  new Promise<QBUser>((resolve, reject) => {
    QB.users.update(userId, data, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

export const qbDeleteUser = (userId: QBUser['id']) =>
  new Promise<QBUser>((resolve, reject) => {
    QB.users.delete(userId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
