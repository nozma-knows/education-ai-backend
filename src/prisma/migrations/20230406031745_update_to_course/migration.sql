/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Prereq` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Prereq` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PrereqTopic` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PrereqTopic` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Unit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Prereq" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "PrereqTopic" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
