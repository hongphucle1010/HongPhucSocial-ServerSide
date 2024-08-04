import { User } from "@prisma/client";
import {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} from "../../model/User";
import { prismaMock } from "../../singleton";
import { isA } from "jest-mock-extended";

describe("Create user", () => {
  it("should create a user", async () => {
    const user = {
      username: "test",
      email: "test@test.vn",
      password: "test",
    };

    const userResponse = {
      ...user,
      id: 1,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.user.create.mockResolvedValue(userResponse);
    await expect(createUser(user)).resolves.toEqual(userResponse);
  });

  it("should throw an error if user is not provided", async () => {
    await expect(createUser({} as User)).rejects.toThrow(
      "Missing required fields"
    );
  });

  it("should throw an error when the username or email is duplicated", async () => {
    const user = {
      username: "test",
      email: "test@test.vn",
      password: "test",
    };

    // First create works
    const userResponse = {
      ...user,
      id: 1,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.user.create.mockResolvedValue(userResponse);
    await expect(createUser(user)).resolves.toEqual(userResponse);

    // Second create fails
    prismaMock.user.create.mockRejectedValue({ code: "P2002" });
    await expect(createUser(user)).rejects.toThrow(
      "Username or email already exists"
    );
  });
});

describe("Find user", () => {
  it("should find a user by id", async () => {
    const mockUser = {
      id: 1,
      username: "test",
      email: "test@test.vn",
      password: "test",
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    await expect(getUserById(1)).resolves.toEqual(mockUser);
  });

  it("should return null if user is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(getUserById(1)).resolves.toBeNull();
  });
});

describe("Update user", () => {
  it("should update a user", async () => {
    const user = {
      id: 1,
      username: "test",
      email: "hongphuc@test.vn",
      password: "test",
    };
    const userResponse = {
      ...user,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.update.mockResolvedValue(userResponse);
    await expect(updateUser(user)).resolves.toEqual(userResponse);
  });

  it("should throw an error if user id is not provided", async () => {
    await expect(updateUser({} as User)).rejects.toThrow("id is required");
  });

  it("should throw an error when the username or email is duplicated", async () => {
    const user = {
      id: 1,
      username: "test",
      email: "test@test.vn",
    };

    prismaMock.user.update.mockRejectedValue({ code: "P2002" });
    await expect(updateUser(user)).rejects.toThrow(
      "Username or email already exists"
    );
  });
});

describe("Delete user", () => {
  it("should delete a user", async () => {
    const mockUser = {
      id: 1,
      username: "test",
      email: "test@test.vn",
      password: "test",
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.user.delete.mockResolvedValue(mockUser);
    await expect(deleteUser(1)).resolves.toEqual(mockUser);
  });
});
