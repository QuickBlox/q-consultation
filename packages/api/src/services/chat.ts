import QB, {
  QBSession,
  QBUser,
  QBChatDialog,
  QBChatMessage,
  QBChatNewMessage,
  // QBSystemMessage,
} from 'quickblox';

export const qbChatConnect = (
  userId: QBUser['id'],
  token: QBSession['token'],
) =>
  new Promise((resolve, reject) => {
    QB.chat.connect({ userId, password: token }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

export const qbChatDisconnect = () => {
  QB.chat.disconnect();
};

export const qbChatCreate = (
  userIds: QBUser['id'] | Array<QBUser['id']>,
  data?: Dictionary<unknown>,
) =>
  new Promise<QBChatDialog>((resolve, reject) => {
    QB.chat.dialog.create(
      {
        name: '-',
        occupants_ids: Array.isArray(userIds) ? userIds : [userIds],
        type: 2,
        data,
      },
      (error, chat) => {
        if (error) {
          reject(error);
        } else {
          resolve(chat);
        }
      },
    );
  });

// export const QBChatSendSystemMessage = (
//   to: QBUser['id'] | string,
//   message: { extension: QBSystemMessage['extension'] },
// ) => {
//   return new Promise<QBSystemMessage['id']>((resolve) => {
//     resolve(QB.chat.sendSystemMessage(to, message));
//   });
// };

export const qbChatJoin = (dialogId: QBChatDialog['_id']) =>
  new Promise((resolve, reject) => {
    const dialogJid = QB.chat.helpers.getRoomJidFromDialogId(dialogId);

    QB.chat.muc.join(dialogJid, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

export const qbChatSendMessage = (to: string, message: QBChatNewMessage) => {
  return new Promise<QBChatMessage['_id']>((resolve) => {
    resolve(QB.chat.send(to, message));
  });
};

// export const waitQbJoinNotificationDialog = async (
//   maxRepeat,
//   cooldown = 1500,
// ) => {
//   const res = await Promise.race([
//     qbJoinNotificationDialog(),
//     new Promise((resolve) => {
//       setTimeout(resolve, cooldown)
//     }),
//   ])

//   if (!res && maxRepeat > 1) {
//     const newRes = await waitQbJoinNotificationDialog(maxRepeat - 1, cooldown)

//     return newRes
//   }

//   return res
// }

// export const qbSendNotificationMessage = (notification) => {
//   QB.chat.send(process.env.NOTIFICATION_ROOM_JID, {
//     type: 'groupchat',
//     extension: {
//       ...notification,
//       save_to_history: 0,
//     },
//     markable: 1,
//   })
// }
