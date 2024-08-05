// Route: /api
import express from "express";
import { routes as v1 } from "./v1";
export const routes = express.Router();

routes.get("/experiment", async (req, res) => {
  const response = {};
  res.json(response);
});

routes.use("/v1", v1);

routes.get("/*", (req, res) => {
  res.json({
    message: "Error: Route not found",
  });
});
