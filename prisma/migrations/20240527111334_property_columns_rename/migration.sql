/*
  Warnings:

  - You are about to drop the column `nearestHospitalDistance` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `nearestMetroDistance` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `nearestSchoolDistance` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "nearestHospitalDistance",
DROP COLUMN "nearestMetroDistance",
DROP COLUMN "nearestSchoolDistance",
ADD COLUMN     "hospitalDistance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "metroDistance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "schoolDistance" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "UsersInfo" ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();
