import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  max?: number;
}

export function StarRating({ rating, onChange, max = 5 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const isFilled = star <= (hoverRating || rating);
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={cn(
              "p-1 rounded-lg transition-all duration-200 hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            <Star
              className={cn(
                "w-10 h-10 transition-all duration-200",
                isFilled
                  ? "fill-survey-star text-survey-star"
                  : "fill-transparent text-muted-foreground"
              )}
            />
          </button>
        );
      })}
      <span className="ml-4 text-lg font-semibold text-foreground">
        {rating > 0 ? `${rating}/${max}` : "Pilih rating"}
      </span>
    </div>
  );
}
