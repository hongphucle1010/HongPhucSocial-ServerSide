import express from "express";
import { createUser, deleteUser } from "../model/User";

export const routes = express.Router();

routes.get("/experiment", async (req, res) => {
  const response = await deleteUser(7);
  console.log(response);
  res.json(response);
});

routes.get("/*", (req, res) => {
  res.json({
    message: "Error: Route not found",
  });
});
