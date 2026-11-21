-- CreateEnum
CREATE TYPE "role_name" AS ENUM ('admin', 'member');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'disabled');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "firstname" VARCHAR(100) NOT NULL,
    "lastname" VARCHAR(100) NOT NULL,
    "role_name" "role_name" NOT NULL DEFAULT 'member',
    "status" "user_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Hand-written (not expressible in schema.prisma): emails are stored lowercase, so the unique
-- index above is case-insensitive in effect; names must not be empty (domain-model.md: 1-100).
ALTER TABLE "users" ADD CONSTRAINT "users_email_lowercase" CHECK ("email" = lower("email"));
ALTER TABLE "users" ADD CONSTRAINT "users_firstname_not_empty" CHECK (char_length("firstname") >= 1);
ALTER TABLE "users" ADD CONSTRAINT "users_lastname_not_empty" CHECK (char_length("lastname") >= 1);
