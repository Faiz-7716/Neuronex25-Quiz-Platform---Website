
import * as React from 'react';
import OverviewDisplay from '@/components/quiz/overview-display';
import { Skeleton } from '@/components/ui/skeleton';

export default function OverviewPage() {
  return (
    <React.Suspense fallback={<OverviewLoadingSkeleton />}>
      <OverviewDisplay />
    </React.Suspense>
  );
}

const OverviewLoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <div className="w-full max-w-7xl">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-20 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-8 w-3/4 mx-auto mb-12" />
      
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
      <div className="text-center">
        <Skeleton className="h-12 w-32 mx-auto" />
      </div>
    </div>
  </div>
);
