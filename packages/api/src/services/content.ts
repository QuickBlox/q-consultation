import QB, { BlobObject, QBContentObject } from 'quickblox';
import FormData from 'form-data';
import fetch from 'node-fetch';
import omit from 'lodash/omit';

const qbCreateFile = (name: string, content_type: string, isPublic?: boolean) =>
  new Promise<BlobObject>((resolve, reject) => {
    QB.content.create(
      { name, content_type, public: isPublic || false },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });

const qbMarkUploaded = (id: number, size: number) =>
  new Promise((resolve, reject) => {
    QB.content.markUploaded({ id, size }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

export const qbUploadFile = async (
  name: string,
  file: Buffer,
  type: string,
  size: number,
  isPublic?: boolean,
): Promise<QBContentObject> => {
  const { session } = QB.service.qbInst;
  const blob = await qbCreateFile(name, type, isPublic);

  const url = new URL(blob.blob_object_access.params);
  const form = new FormData();

  url.searchParams.forEach((value, key) => {
    form.append(key, value);
  });
  form.append('file', file, name);

  await fetch(`${url.origin}${url.pathname}`, {
    method: 'POST',
    headers: {
      'QB-Token': session?.token || '',
    },
    body: form,
  });

  await qbMarkUploaded(blob.id, size);

  const fileData = omit(blob, [
    'blob_object_access',
    'blob_status',
    'set_completed_at',
  ]);

  return fileData;
};

export function qbDeleteFile(contentId: QBContentObject['id']) {
  return new Promise((resolve, reject) => {
    QB.content.delete(contentId, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}
