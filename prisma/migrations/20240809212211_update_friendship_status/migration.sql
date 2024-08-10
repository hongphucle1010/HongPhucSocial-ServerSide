/*
  Warnings:

  - The `status` column on the `Friendship` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('pending', 'rejected', 'accepted', 'none');

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "status",
ADD COLUMN     "status" "FriendshipStatus" NOT NULL DEFAULT 'pending';
