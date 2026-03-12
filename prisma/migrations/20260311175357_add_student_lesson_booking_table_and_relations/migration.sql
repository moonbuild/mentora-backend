/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Task";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "StudentProfile" (
    "student_profile_id" TEXT NOT NULL PRIMARY KEY,
    "parent_user_id" TEXT NOT NULL,
    "student_user_id" TEXT NOT NULL,
    CONSTRAINT "StudentProfile_parent_user_id_fkey" FOREIGN KEY ("parent_user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentProfile_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lesson" (
    "lesson_id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    CONSTRAINT "Lesson_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "session_id" TEXT NOT NULL PRIMARY KEY,
    "lesson_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "topic" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    CONSTRAINT "Session_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson" ("lesson_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "booking_id" TEXT NOT NULL PRIMARY KEY,
    "lesson_id" TEXT NOT NULL,
    "student_profile_id" TEXT NOT NULL,
    CONSTRAINT "Booking_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson" ("lesson_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_student_profile_id_fkey" FOREIGN KEY ("student_profile_id") REFERENCES "StudentProfile" ("student_profile_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_student_user_id_key" ON "StudentProfile"("student_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_lesson_id_student_profile_id_key" ON "Booking"("lesson_id", "student_profile_id");
