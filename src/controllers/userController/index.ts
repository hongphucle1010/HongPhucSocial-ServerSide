import { Request, Response } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  getUserByUsername,
} from "../../model/User";

export async function createUserController(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function getUserByIdController(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function getUserByUsernameController(req: Request, res: Response) {
  try {
    const user = await getUserByUsername(req.params.username);
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }
    const user = await updateUser({ ...req.body, id: userId });
    res.status(200).json(user);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
