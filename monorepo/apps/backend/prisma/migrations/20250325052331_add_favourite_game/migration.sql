-- CreateTable
CREATE TABLE "FavouriteGame" (
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FavouriteGame_pkey" PRIMARY KEY ("gameId")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteGame_userId_key" ON "FavouriteGame"("userId");

-- AddForeignKey
ALTER TABLE "FavouriteGame" ADD CONSTRAINT "FavouriteGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
