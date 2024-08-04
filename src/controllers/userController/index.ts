import { createUser, getUserById, updateUser } from "../../model/User";

export async function createUserController(req: any, res: any) {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function getUserByIdController(req: any, res: any) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function updateUserController(req: any, res: any) {
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
