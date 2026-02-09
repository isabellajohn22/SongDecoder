/*
  Warnings:

  - You are about to drop the `track_analyses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "track_analyses" DROP CONSTRAINT "track_analyses_trackId_fkey";

-- DropTable
DROP TABLE "track_analyses";

-- CreateTable
CREATE TABLE "track_analysis_cache" (
    "id" TEXT NOT NULL,
    "trackName" VARCHAR(512) NOT NULL,
    "artistName" VARCHAR(512) NOT NULL,
    "trackKey" VARCHAR(1024) NOT NULL,
    "externalUrl" VARCHAR(512),
    "analysisJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastAccessedAt" TIMESTAMP(3),

    CONSTRAINT "track_analysis_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_analysis_cache_trackKey_key" ON "track_analysis_cache"("trackKey");

-- CreateIndex
CREATE INDEX "track_analysis_cache_trackKey_idx" ON "track_analysis_cache"("trackKey");

-- CreateIndex
CREATE INDEX "track_analysis_cache_expiresAt_idx" ON "track_analysis_cache"("expiresAt");
