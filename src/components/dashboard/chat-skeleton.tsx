import { Skeleton } from "@/components/ui/skeleton"

export function ChatSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="flex items-start space-x-4 justify-end">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 ml-auto" />
            <Skeleton className="h-4 w-1/2 ml-auto" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex items-start space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    </div>
  )
} 