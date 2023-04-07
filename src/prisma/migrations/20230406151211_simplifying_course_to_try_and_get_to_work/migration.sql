/*
  Warnings:

  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrereqTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_unitId_fkey";

-- DropForeignKey
ALTER TABLE "PrereqTopic" DROP CONSTRAINT "PrereqTopic_prereqId_fkey";

-- DropTable
DROP TABLE "Lesson";

-- DropTable
DROP TABLE "PrereqTopic";
