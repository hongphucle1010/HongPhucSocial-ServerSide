import { deleteUser } from "../../model/User";

export async function deleteUserController(req: any, res: any) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }
    await deleteUser(userId);
    res.status(204).send();
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
