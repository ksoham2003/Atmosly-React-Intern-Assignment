import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(12)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-12 h-12 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="w-6 h-6 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-3 w-full mt-3" />
            <Skeleton className="h-3 w-2/3 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}