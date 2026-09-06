-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredPlatformIds" INTEGER[] DEFAULT ARRAY[6, 167, 169, 508, 48, 49]::INTEGER[];
