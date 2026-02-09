-- CreateTable
CREATE TABLE "tracks" (
    "id" VARCHAR(64) NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    "albumId" VARCHAR(64) NOT NULL,
    "albumName" VARCHAR(512) NOT NULL,
    "albumImageUrl" VARCHAR(512),
    "externalUrl" VARCHAR(512) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" VARCHAR(64) NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_artists" (
    "trackId" VARCHAR(64) NOT NULL,
    "artistId" VARCHAR(64) NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "track_artists_pkey" PRIMARY KEY ("trackId","artistId")
);

-- CreateTable
CREATE TABLE "audio_features" (
    "trackId" VARCHAR(64) NOT NULL,
    "bpmInt" INTEGER NOT NULL,
    "keyName" VARCHAR(16) NOT NULL,
    "modeName" VARCHAR(16) NOT NULL,
    "timeSignature" INTEGER NOT NULL,
    "loudness" DOUBLE PRECISION NOT NULL,
    "energy" DOUBLE PRECISION NOT NULL,
    "danceability" DOUBLE PRECISION NOT NULL,
    "valence" DOUBLE PRECISION NOT NULL,
    "acousticness" DOUBLE PRECISION NOT NULL,
    "instrumentalness" DOUBLE PRECISION NOT NULL,
    "liveness" DOUBLE PRECISION NOT NULL,
    "speechiness" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audio_features_pkey" PRIMARY KEY ("trackId")
);

-- CreateTable
CREATE TABLE "track_analyses" (
    "trackId" VARCHAR(64) NOT NULL,
    "genresJson" JSONB NOT NULL,
    "genreCrossoverJson" JSONB NOT NULL,
    "vibeTagsJson" JSONB NOT NULL,
    "explanationJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "track_analyses_pkey" PRIMARY KEY ("trackId")
);

-- CreateTable
CREATE TABLE "recommendation_sets" (
    "id" UUID NOT NULL,
    "seedTrackId" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_items" (
    "recommendationSetId" UUID NOT NULL,
    "recommendedTrackId" VARCHAR(64) NOT NULL,
    "rank" INTEGER NOT NULL,
    "distanceScore" DOUBLE PRECISION NOT NULL,
    "reason" VARCHAR(512) NOT NULL,

    CONSTRAINT "recommendation_items_pkey" PRIMARY KEY ("recommendationSetId","recommendedTrackId")
);

-- CreateIndex
CREATE INDEX "track_artists_trackId_idx" ON "track_artists"("trackId");

-- CreateIndex
CREATE INDEX "track_artists_artistId_idx" ON "track_artists"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_sets_seedTrackId_key" ON "recommendation_sets"("seedTrackId");

-- CreateIndex
CREATE INDEX "recommendation_items_recommendationSetId_rank_idx" ON "recommendation_items"("recommendationSetId", "rank");

-- AddForeignKey
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_features" ADD CONSTRAINT "audio_features_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_analyses" ADD CONSTRAINT "track_analyses_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_sets" ADD CONSTRAINT "recommendation_sets_seedTrackId_fkey" FOREIGN KEY ("seedTrackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_items" ADD CONSTRAINT "recommendation_items_recommendationSetId_fkey" FOREIGN KEY ("recommendationSetId") REFERENCES "recommendation_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_items" ADD CONSTRAINT "recommendation_items_recommendedTrackId_fkey" FOREIGN KEY ("recommendedTrackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
