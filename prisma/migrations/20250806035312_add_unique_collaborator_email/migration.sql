/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Collaborator` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_email_key" ON "public"."Collaborator"("email");
