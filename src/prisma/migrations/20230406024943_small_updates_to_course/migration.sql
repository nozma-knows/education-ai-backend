/*
  Warnings:

  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Prereq` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_prereqId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Prereq" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Topic";

-- CreateTable
CREATE TABLE "PrereqTopic" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "prereqId" TEXT,
    "title" TEXT NOT NULL,
    "desciption" TEXT NOT NULL,

    CONSTRAINT "PrereqTopic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrereqTopic" ADD CONSTRAINT "PrereqTopic_prereqId_fkey" FOREIGN KEY ("prereqId") REFERENCES "Prereq"("id") ON DELETE SET NULL ON UPDATE CASCADE;
