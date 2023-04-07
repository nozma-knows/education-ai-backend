/*
  Warnings:

  - You are about to drop the column `description` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `intendedOutcomes` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `Prereq` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Prereq" DROP CONSTRAINT "Prereq_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_courseId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "description",
DROP COLUMN "intendedOutcomes",
DROP COLUMN "title",
ADD COLUMN     "content" TEXT NOT NULL;

-- DropTable
DROP TABLE "Prereq";

-- DropTable
DROP TABLE "Unit";
