/*
  Warnings:

  - Added the required column `summary` to the `UnitLesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UnitLesson" ADD COLUMN     "summary" TEXT NOT NULL;
