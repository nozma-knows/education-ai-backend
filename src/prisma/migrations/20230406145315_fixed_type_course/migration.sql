/*
  Warnings:

  - You are about to drop the column `desciption` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `desciption` on the `Prereq` table. All the data in the column will be lost.
  - You are about to drop the column `desciption` on the `PrereqTopic` table. All the data in the column will be lost.
  - Added the required column `description` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Prereq` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `PrereqTopic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Prereq" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PrereqTopic" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT NOT NULL;
