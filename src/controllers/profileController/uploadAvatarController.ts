import uploadMulter from "../../helper/multer";
import {
  deleteBlob,
  extractBlobName,
  uploadBlob,
} from "../../helper/azure/storageBlob";
import { imageResize } from "../../helper/imageResize";
import path from "path";
import { getProfileByUserId, updateProfile } from "../../model/Profile";

async function handleUploadAvatar(req: any, res: any) {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file." });
  }

  if (!req.file.mimetype.startsWith("image")) {
    return res.status(400).json({ message: "Please upload an image file." });
  }

  const profile = await getProfileByUserId(req.user.id);

  const oldAvatarUrl = profile?.avatarUrl;
  console.log("Old avatar: ", oldAvatarUrl);
  if (oldAvatarUrl) {
    const blobName = extractBlobName(oldAvatarUrl);
    await deleteBlob(blobName);
  }

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  try {
    const blobName = Date.now() + path.extname(req.file.originalname);
    const buffer = await imageResize(req.file.buffer, 200, 200);

    const blobUrl = await uploadBlob(blobName, buffer);

    await updateProfile({
      id: profile.id,
      avatarUrl: blobUrl,
    });

    return res.status(200).json({
      message: "File uploaded successfully.",
      url: blobUrl,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export const uploadAvatarController = [
  uploadMulter.single("file"),
  handleUploadAvatar,
];

export async function deleteAvatarController(req: any, res: any) {
  try {
    const profile = await getProfileByUserId(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    if (!profile.avatarUrl) {
      return res.status(400).json({ message: "No avatar to delete" });
    }
    const blobName = extractBlobName(profile.avatarUrl);
    await deleteBlob(blobName);
    await updateProfile({
      id: profile.id,
      avatarUrl: null,
    });
    return res.status(200).json({ message: "File deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
