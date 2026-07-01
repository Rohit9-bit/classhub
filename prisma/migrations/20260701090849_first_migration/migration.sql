/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assignments" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "logoUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "topics" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "units" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "verifyCode" TEXT,
ADD COLUMN     "verifyCodeExpiry" TIMESTAMP(3);
