-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SELLER', 'BUYER');

-- CreateTable
CREATE TABLE "UsersInfo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "contact" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "UsersInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ownerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "amenities" TEXT[],
    "nearbySchools" TEXT[],
    "nearbyHospitals" TEXT[],
    "nearbyMetros" TEXT[],
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "area" TEXT NOT NULL DEFAULT '',
    "images" TEXT[],
    "description" TEXT NOT NULL,
    "tenantId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "likesCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLikes" (
    "userId" UUID NOT NULL,
    "propertyId" UUID NOT NULL,

    CONSTRAINT "UserLikes_pkey" PRIMARY KEY ("userId","propertyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsersInfo_email_key" ON "UsersInfo"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Property_tenantId_key" ON "Property"("tenantId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "UsersInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "UsersInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikes" ADD CONSTRAINT "UserLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikes" ADD CONSTRAINT "UserLikes_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
