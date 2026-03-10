import { useEffect, useRef, useState } from "react"
import { cn } from "@lib/utils"

interface InfiniteScrollProps {
  children: React.ReactNode
  hasMore: boolean
  onLoadMore: () => void
  threshold?: number
  className?: string
  loader?: React.ReactNode
}

export function InfiniteScroll({
  children,
  hasMore,
  onLoadMore,
  threshold = 100,
  className,
  loader,
}: InfiniteScrollProps) {
  const [isLoading, setIsLoading] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observerTargetRef = observerTarget.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true)
          onLoadMore()
          // Reset loading state after a short delay to prevent rapid fire calls
          setTimeout(() => setIsLoading(false), 500)
        }
      },
      { rootMargin: `${threshold}px` }
    )

    if (observerTargetRef) {
      observer.observe(observerTargetRef)
    }

    return () => {
      if (observerTargetRef) {
        observer.unobserve(observerTargetRef)
      }
    }
  }, [hasMore, isLoading, onLoadMore, threshold])

  return (
    <div className={cn("", className)}>
      {children}
      <div ref={observerTarget} className="w-full">
        {isLoading &&
          (loader || (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ))}
      </div>
    </div>
  )
}
