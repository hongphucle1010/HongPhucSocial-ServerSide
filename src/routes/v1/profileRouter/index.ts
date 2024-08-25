// Route: /api/v1/profile
import express from "express";
import {
  createProfileController,
  getProfileByUsernameController,
} from "../../../controllers/profileController";
import {
  deleteAvatarController,
  uploadAvatarController,
} from "../../../controllers/profileController/uploadAvatarController";
import {
  blockNotLoggedIn,
  isLoginAuth,
} from "../../../controllers/authController/login";
export const profileRouter = express.Router();

profileRouter.get("/:username", getProfileByUsernameController);

profileRouter.post("/", createProfileController);

// profileRouter.put("/:id", updateProfileController);

// profileRouter.delete("/:id", deleteProfileController);

profileRouter.post("/upload/avatar", [
  isLoginAuth,
  blockNotLoggedIn,
  ...uploadAvatarController,
]);

profileRouter.delete("/upload/avatar", [
  isLoginAuth,
  blockNotLoggedIn,
  deleteAvatarController,
]);
