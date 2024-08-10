import { Request, Response } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  getUserByUsername,
  getPasswordById,
} from "../../model/User";
import { getProfileByUserId } from "../../model/Profile";
import {
  getUserWithProfile,
  updateUserWithProfile,
} from "../../model/UserWithProfile";
import bcryptjs from "bcryptjs";

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

export async function getUserController(req: any, res: Response) {
  try {
    if (!req.user) {
      throw new Error("User not found");
    }
    const user = await getUserWithProfile(req.user.id);
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({ ...user });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function updateUserWithProfileController(req: any, res: Response) {
  try {
    const userId = parseInt(req.user?.id);
    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }
    console.log(req.body);
    const user = await updateUserWithProfile(userId, req.body);
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
}

export async function updatePasswordController(req: any, res: Response) {
  try {
    const userId = parseInt(req.user?.id);
    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }

    // Find the user password from the database
    const user = await getPasswordById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const { password } = user;
    if (bcryptjs.compareSync(req.body.password, password)) {
      const newPassword = bcryptjs.hashSync(req.body.newPassword, 10);
      const user = await updateUser({ id: userId, password: newPassword });
      res.status(200).json({
        message: "Password updated successfully",
      });
    } else {
      throw new Error("Incorrect password");
    }
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
