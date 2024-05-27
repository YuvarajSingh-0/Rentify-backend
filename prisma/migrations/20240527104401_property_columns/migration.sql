-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "nearestHospitalDistance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nearestMetroDistance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nearestSchoolDistance" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "UsersInfo" ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();
