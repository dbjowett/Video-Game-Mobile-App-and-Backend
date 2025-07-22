/*
  Warnings:

  - Added the required column `gameCoverUrl` to the `GameListItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameListItem" ADD COLUMN     "gameCoverUrl" TEXT NOT NULL;
