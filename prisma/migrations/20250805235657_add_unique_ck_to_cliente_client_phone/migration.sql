/*
  Warnings:

  - A unique constraint covering the columns `[client_phone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_client_phone_key" ON "public"."Client"("client_phone");
