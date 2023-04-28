import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { MultipartFile, QCRecord } from '@/models';
import { getCompletion, getTranscription } from '@/services/openai';
import { qbCreateChildCustomObject } from '@/services/customObject';
import { qbUploadFile } from '@/services/content';
import { QBRecord } from 'quickblox';

const createRecord: FastifyPluginAsyncTypebox = async (fastify) => {
  const createRecordSchema = {
    tags: ['providers'],
    consumes: ['multipart/form-data'],
    params: Type.Object({
      id: Type.String({ pattern: '^[a-z0-9]{24}$' }),
    }),
    body: fastify.config.AI_RECORD_ANALYTICS
      ? Type.Object({
          audio: MultipartFile,
          video: Type.Optional(MultipartFile),
        })
      : Type.Object({
          video: MultipartFile,
        }),
    response: {
      200: Type.Ref(QCRecord),
    },
    security: [
      {
        apiKey: [],
      },
    ],
  };

  fastify.post(
    '',
    {
      schema: createRecordSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
        fastify.ProviderSessionToken,
      ),
    },
    async (request) => {
      const { id } = request.params;
      const audio =
        fastify.config.AI_RECORD_ANALYTICS && 'audio' in request.body
          ? request.body.audio
          : null;
      const video = 'video' in request.body ? request.body.video : null;

      const videoData =
        video &&
        (await qbUploadFile(
          video.filename,
          video.buffer,
          video.mimetype,
          Buffer.byteLength(video.buffer),
        ));

      const transcription =
        audio && (await getTranscription(audio.filename, audio.buffer));

      const summary =
        transcription &&
        (await getCompletion(
          `Convert this shorthand into a first-hand account of the meeting:\n\n${transcription}\n`,
        ));

      const record = await qbCreateChildCustomObject<QBRecord>(
        'Appointment',
        id,
        'Record',
        {
          appointment_id: id,
          name: video?.filename || audio?.filename,
          uid: videoData?.uid,
          summary,
          transcription,
        },
      );

      return record;
    },
  );
};

export default createRecord;
