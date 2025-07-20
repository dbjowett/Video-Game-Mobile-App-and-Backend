/*
  Warnings:

  - You are about to drop the `UserGameList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserGameList" DROP CONSTRAINT "UserGameList_userId_fkey";

-- DropTable
DROP TABLE "UserGameList";

-- DropEnum
DROP TYPE "GameListType";

-- CreateTable
CREATE TABLE "GameList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameListItem" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameListLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameListId" TEXT NOT NULL,

    CONSTRAINT "GameListLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameList_userId_name_key" ON "GameList"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "GameListItem_listId_gameId_key" ON "GameListItem"("listId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "GameListLike_userId_gameListId_key" ON "GameListLike"("userId", "gameListId");

-- AddForeignKey
ALTER TABLE "GameList" ADD CONSTRAINT "GameList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListItem" ADD CONSTRAINT "GameListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "GameList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListLike" ADD CONSTRAINT "GameListLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListLike" ADD CONSTRAINT "GameListLike_gameListId_fkey" FOREIGN KEY ("gameListId") REFERENCES "GameList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
