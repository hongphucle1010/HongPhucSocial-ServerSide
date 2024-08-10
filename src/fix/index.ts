import prisma from "../client";

export default async function fix(req: any, res: any) {
  prisma.user.findMany().then((users) => {
    users.forEach(async (user) => {
      const userId = user.id;
      // Create profile for user

      const profile = await prisma.profile.create({
        data: {
          userId: userId,
        },
      });
      console.log(profile);
    });
  });
  res.json({ message: "Fix route" });
}
