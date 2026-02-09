'use client';

/**
 * LoadingSkeleton Component
 * ============================================================================
 * Displays a loading skeleton that mimics the structure of the results view.
 * Provides visual feedback while the analysis is in progress.
 * ============================================================================
 */

export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse-slow">
      {/* Track header skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-start gap-4">
          {/* Album art skeleton */}
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0" />
          
          {/* Track info skeleton */}
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
        </div>
      </div>

      {/* TL;DR skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
        </div>
      </div>

      {/* Fingerprint skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        
        {/* Metrics grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12 mx-auto mb-2" />
              <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
            />
          ))}
        </div>
      </div>

      {/* Recommendations skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
