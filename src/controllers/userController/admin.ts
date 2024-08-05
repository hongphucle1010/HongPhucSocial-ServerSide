import { Request, Response } from "express";
import { deleteUser } from "../../model/User";

export async function deleteUserController(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }
    const response = await deleteUser(userId);
    res.status(200).json(response);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
