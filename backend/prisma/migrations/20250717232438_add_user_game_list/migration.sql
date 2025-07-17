-- CreateEnum
CREATE TYPE "GameListType" AS ENUM ('FAVOURITES');

-- CreateTable
CREATE TABLE "UserGameList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "listType" "GameListType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGameList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGameList_userId_gameId_listType_key" ON "UserGameList"("userId", "gameId", "listType");

-- AddForeignKey
ALTER TABLE "UserGameList" ADD CONSTRAINT "UserGameList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
