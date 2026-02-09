/**
 * Zod Validation Schemas
 *
 * Request validation schemas for API endpoints.
 */

import { z } from 'zod';

/**
 * Schema for the /api/analyze endpoint request body.
 */
export const analyzeRequestSchema = z.object({
  track: z
    .string()
    .min(1, 'Track name is required')
    .max(200, 'Track name too long'),
  artist: z
    .string()
    .max(200, 'Artist name too long')
    .optional(),
});

/**
 * Type for the validated analyze request
 */
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

/**
 * Schema for track search request
 */
export const searchRequestSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(200, 'Search query too long'),
  artist: z
    .string()
    .max(200, 'Artist name too long')
    .optional(),
});

/**
 * Type for validated search request
 */
export type SearchRequest = z.infer<typeof searchRequestSchema>;
