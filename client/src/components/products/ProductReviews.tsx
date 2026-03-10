import { Component } from "@shared"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { RatingStars } from "@components/common/RatingStars"
import { Skeleton } from "@components/ui/skeleton"
import { User } from "lucide-react"
import { cn } from "@lib/utils"

interface ProductReviewsProps {
  component: Component
  className?: string
}

export function ProductReviews({ component, className }: ProductReviewsProps) {
  const reviews = component.reviews || []
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  // Calculate rating distribution
  const getDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
      const rating = Math.floor(review.rating)
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++
      }
    })
    return distribution
  }

  const distribution = getDistribution()
  const totalReviews = reviews.length

  if (reviews.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No reviews available for this component.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Rating Summary */}
        <div className="flex items-center gap-6 mb-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
            <RatingStars rating={averageRating} count={totalReviews} />
            <p className="text-sm text-muted-foreground mt-1">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating as keyof typeof distribution]
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 mt-6">
          <h4 className="font-medium">Recent Reviews</h4>
          {reviews.slice(0, 5).map((review) => (
            <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {review.authorName || review.user?.username || "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <RatingStars rating={review.rating} />
              </div>

              {review.title && (
                <h5 className="font-medium text-sm mb-1">{review.title}</h5>
              )}
              {review.content && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {review.content}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Show All Link */}
        {reviews.length > 5 && (
          <button className="text-sm text-primary hover:underline mt-4">
            View all {reviews.length} reviews
          </button>
        )}
      </CardContent>
    </Card>
  )
}
