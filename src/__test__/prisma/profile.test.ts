import {
  createProfile,
  updateProfile,
  getProfile,
  deleteProfile,
} from "../../model/Profile";
import { prismaMock } from "../../singleton";
import { Profile } from "@prisma/client";

describe("Create profile", () => {
  it("should create a profile", async () => {
    const profile = {
      name: "test",
      bio: "test",
      avatar: "test",
      userId: 1,
    };

    const profileResponse: Profile = {
      ...profile,
      avatarUrl: null,
      id: 1,
    };
    prismaMock.profile.create.mockResolvedValue(profileResponse);
    await expect(createProfile(profile)).resolves.toEqual(profileResponse);
  });

  it("should throw an error if profile is not provided", async () => {
    await expect(createProfile({} as any)).rejects.toThrow(
      "User ID is required"
    );
  });

  it("should throw an error when the userID given is existing", async () => {
    const profile = {
      name: "test",
      bio: "test",
      avatar: "test",
      userId: 1,
    };

    // First create works
    const profileResponse = {
      ...profile,
      avatarUrl: null,
      id: 1,
    };
    prismaMock.profile.create.mockResolvedValue(profileResponse);
    await expect(createProfile(profile)).resolves.toEqual(profileResponse);

    // Second create fails
    prismaMock.profile.create.mockRejectedValue({ code: "P2002" });
    await expect(createProfile(profile)).rejects.toThrow(
      "Profile already exists"
    );
  });
});

describe("Get profile", () => {
  it("should get a profile", async () => {
    const profile: Profile = {
      id: 1,
      bio: "test",
      avatarUrl: "test",
      userId: 1,
    };

    prismaMock.profile.findUnique.mockResolvedValue(profile);
    await expect(getProfile(1)).resolves.toEqual(profile);
  });
});

describe("Update profile", () => {
  it("should update a profile", async () => {
    const profile = {
      id: 1,
      name: "test",
      bio: "test",
      avatar: "test",
    };

    const profileResponse = {
      ...profile,
      avatarUrl: null,
      userId: 1,
    };
    prismaMock.profile.update.mockResolvedValue(profileResponse);
    await expect(updateProfile(profile)).resolves.toEqual(profileResponse);
  });

  it("should throw an error if id is not provided", async () => {
    await expect(updateProfile({} as any)).rejects.toThrow("id is required");
  });
});

describe("Delete profile", () => {
  it("should delete a profile", async () => {
    const profileResponse: Profile = {
      id: 1,
      bio: "test",
      avatarUrl: "test",
      userId: 1,
    };
    prismaMock.profile.delete.mockResolvedValue(profileResponse);
    await expect(deleteProfile(1)).resolves.toEqual(profileResponse);
  });
});
