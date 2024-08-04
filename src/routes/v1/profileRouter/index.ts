import express from "express";
import {
  createProfileController,
  getProfileController,
  updateProfileController,
  deleteProfileController,
} from "../../../controllers/profileController";
export const profileRouter = express.Router();

profileRouter.get("/:id", getProfileController);

profileRouter.post("/", createProfileController);

profileRouter.put("/:id", updateProfileController);

profileRouter.delete("/:id", deleteProfileController);
