import { Star, StarHalf } from "lucide-react"
import { cn } from "@lib/utils"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  count?: number
  className?: string
}

export function RatingStars({
  rating,
  maxRating = 5,
  count,
  className,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-primary text-primary"
        />
      ))}
      {hasHalfStar && (
        <StarHalf className="h-4 w-4 fill-primary text-primary" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="h-4 w-4 text-muted-foreground"
        />
      ))}
      {count !== undefined && (
        <span className="text-sm text-muted-foreground ml-2">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}
