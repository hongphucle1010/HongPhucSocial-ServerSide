import uploadMulter from '../../helper/multer';
import {
  deleteBlob,
  extractBlobName,
  uploadBlob,
} from '../../helper/azure/storageBlob';
import { imageResize } from '../../helper/imageResize';
import path from 'path';
import { getProfileByUserId, updateProfile } from '../../model/Profile';
import { HttpError } from '../../lib/error/HttpErrors';
import ERROR_MESSAGES from '../../configs/errorMessages';
import { HttpStatus } from '../../lib/statusCode';
import SUCCESS_MESSAGES from '../../configs/successMessages';
import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const handleUploadAvatar = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new HttpError(
        ERROR_MESSAGES.profile.missingFile,
        HttpStatus.BadRequest,
      );
    }

    if (!req.file.mimetype.startsWith('image')) {
      throw new HttpError(
        ERROR_MESSAGES.profile.invalidFileType,
        HttpStatus.BadRequest,
      );
    }

    const profile = await getProfileByUserId(req.user.id);

    const oldAvatarUrl = profile?.avatarUrl;
    try {
      if (oldAvatarUrl) {
        const blobName = extractBlobName(oldAvatarUrl);
        await deleteBlob(blobName);
      }
    } catch (error: any) {
      console.error('Error deleting old avatar: ', error.message);
      throw new HttpError(error.message, HttpStatus.InternalServerError);
    } finally {
      if (!profile) {
        throw new HttpError(
          ERROR_MESSAGES.profile.notFound,
          HttpStatus.NotFound,
        );
      }

      const blobName = Date.now() + path.extname(req.file.originalname);
      const buffer = await imageResize(
        req.file.buffer,
        HttpStatus.OK,
        HttpStatus.OK,
      );

      const blobUrl = await uploadBlob(blobName, buffer);

      await updateProfile({
        id: profile.id,
        avatarUrl: blobUrl,
      });

      res.status(HttpStatus.OK).json({
        message: SUCCESS_MESSAGES.profile.uploadAvatar,
        url: blobUrl,
      });
    }
  },
);
export const uploadAvatarController = [
  uploadMulter.single('file'),
  handleUploadAvatar,
];

export const deleteAvatarController = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const profile = await getProfileByUserId(req.user.id);
  if (!profile) {
    throw new HttpError(ERROR_MESSAGES.profile.notFound, HttpStatus.NotFound);
  }
  if (!profile.avatarUrl) {
    throw new HttpError(
      ERROR_MESSAGES.profile.noAvatarToDelete,
      HttpStatus.BadRequest,
    );
  }
  const blobName = extractBlobName(profile.avatarUrl);
  await deleteBlob(blobName);
  await updateProfile({
    id: profile.id,
    avatarUrl: null,
  });
  res.status(HttpStatus.OK).json({ message: SUCCESS_MESSAGES.profile.deleteAvatar });
});
