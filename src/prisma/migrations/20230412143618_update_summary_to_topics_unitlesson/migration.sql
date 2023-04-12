/*
  Warnings:

  - You are about to drop the column `summary` on the `UnitLesson` table. All the data in the column will be lost.
  - Added the required column `topics` to the `UnitLesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UnitLesson" DROP COLUMN "summary",
ADD COLUMN     "topics" TEXT NOT NULL;
