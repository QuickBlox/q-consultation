import { QBUser, QBUserCustomData } from 'quickblox';
// import { Static } from '@sinclair/typebox';
// import pick from 'lodash/pick';
// import { QCClient, QCProvider } from '@/models';

export const userHasTag = (user: QBUser, tag: string) => {
  return user.user_tags?.includes(tag);
};

export const parseUserCustomData = (
  customDataText: string | null,
): QBUserCustomData => {
  try {
    const customData: QBUserCustomData = customDataText
      ? JSON.parse(customDataText)
      : {};

    return customData;
  } catch (error) {
    return {};
  }
};

export const stringifyUserCustomData = (
  customDataText?: QBUserCustomData | null,
): string | undefined => {
  try {
    const customData: string | undefined = customDataText
      ? JSON.stringify(customDataText)
      : undefined;

    return customData;
  } catch (error) {
    return undefined;
  }
};

// export const parseProvider = (
//   user: QBUser,
// ): Static<typeof QCProvider> | null => {
//   if (!userHasTag(user, 'provider')) {
//     return null;
//   }

//   const { custom_data, ...data } = pick(
//     user,
//     'id',
//     'full_name',
//     'email',
//     'login',
//     'phone',
//     'created_at',
//     'updated_at',
//     'last_request_at',
//     'custom_data',
//   );
//   const customData = parseUserCustomData(custom_data);

//   return {
//     ...data,
//     full_name: customData.full_name || data.full_name,
//     description: customData.description,
//     language: customData.language,
//   };
// };

// export const parseClient = (user: QBUser): Static<typeof QCClient> | null => {
//   if (userHasTag(user, 'provider')) {
//     return null;
//   }

//   const { custom_data, ...data } = pick(
//     user,
//     'id',
//     'full_name',
//     'email',
//     'login',
//     'phone',
//     'created_at',
//     'updated_at',
//     'last_request_at',
//     'custom_data',
//   );
//   const customData = parseUserCustomData(custom_data);

//   return {
//     ...data,
//     full_name: customData.full_name || data.full_name,
//     address: customData.address,
//     birthdate: customData.birthdate || '',
//     gender:
//       customData.gender === 'male' || customData.gender === 'female'
//         ? customData.gender
//         : 'male',
//     language: customData.language,
//   };
// };
