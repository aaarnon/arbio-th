/**
 * Loading Skeleton Component
 * Displays animated placeholder while content loads
 */
export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-lg border border-gray-200 bg-gray-100"
        >
          <div className="p-4">
            <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
            <div className="mb-2 h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

