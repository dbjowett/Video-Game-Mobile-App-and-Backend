/*
  Warnings:

  - You are about to drop the `FavouriteGame` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavouriteGame" DROP CONSTRAINT "FavouriteGame_userId_fkey";

-- DropTable
DROP TABLE "FavouriteGame";
