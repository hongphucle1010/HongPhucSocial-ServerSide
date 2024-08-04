import express from "express";
import {
  createProfileController,
  getProfileController,
  updateProfileController,
} from "../../../controllers/profileController";
export const profileRouter = express.Router();

profileRouter.get("/", getProfileController);

profileRouter.post("/", createProfileController);

profileRouter.put("/:id", updateProfileController);
