/*
  Warnings:

  - You are about to drop the column `name` on the `GameList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,title]` on the table `GameList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `GameList` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GameList_userId_name_key";

-- AlterTable
ALTER TABLE "GameList" DROP COLUMN "name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "GameList_userId_idx" ON "GameList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GameList_userId_title_key" ON "GameList"("userId", "title");
