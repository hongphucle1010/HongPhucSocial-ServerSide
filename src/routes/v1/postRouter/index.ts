// Route: /api/v1/post
import express from "express";
import {
  createPostController,
  getPostController,
  updatePostController,
  deletePostController,
} from "../../../controllers/postController";

export const postRouter = express.Router();

postRouter.get("/:id", getPostController);

postRouter.post("/", createPostController);

postRouter.put("/:id", updatePostController);

postRouter.delete("/:id", deletePostController);
