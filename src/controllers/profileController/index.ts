import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../../model/Profile";

export async function createProfileController(req: any, res: any) {
  try {
    const profile = await createProfile(req.body);
    res.status(201).json(profile);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function getProfileController(req: any, res: any) {
  try {
    const profileId = parseInt(req.params.id);
    if (isNaN(profileId)) {
      throw new Error("Invalid profile ID");
    }
    const profile = await getProfile(profileId);
    res.status(200).json(profile);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function updateProfileController(req: any, res: any) {
  try {
    const profileId = parseInt(req.params.id);
    if (isNaN(profileId)) {
      throw new Error("Invalid profile ID");
    }
    const profile = await updateProfile({ ...req.body, id: profileId });
    res.status(200).json(profile);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function deleteProfileController(req: any, res: any) {
  try {
    const profileId = parseInt(req.params.id);
    if (isNaN(profileId)) {
      throw new Error("Invalid profile ID");
    }
    await deleteProfile(profileId);
    res.status(204).send();
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
