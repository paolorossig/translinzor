import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ChartSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BarChartSkeleton({ className }: ChartSkeletonProps) {
  return (
    <div className={cn('flex h-[350px] w-full gap-8', className)}>
      <div className="mx-auto flex w-full max-w-lg justify-between pl-6">
        <Skeleton className="h-full w-10" />
        <Skeleton className="h-full w-10" />
        <Skeleton className="h-full w-10" />
        <Skeleton className="h-full w-10" />
        <Skeleton className="h-full w-10" />
        <Skeleton className="h-full w-10" />
      </div>
    </div>
  )
}
