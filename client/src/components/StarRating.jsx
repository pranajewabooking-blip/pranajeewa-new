import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  count,
  size = 18,
  interactive = false,
  onChange,
  className = "",
  countClassName = "text-slate-600"
}) {
  const rounded = Math.round(Number(value) || 0);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= rounded;
          const IconWrapper = interactive ? "button" : "span";

          return (
            <IconWrapper
              key={star}
              type={interactive ? "button" : undefined}
              onClick={interactive ? () => onChange?.(star) : undefined}
              className={interactive ? "text-brand-gold transition hover:scale-110" : "text-brand-gold"}
              aria-label={interactive ? `${star} star rating` : undefined}
            >
              <Star
                size={size}
                className={filled ? "fill-current" : ""}
                strokeWidth={2.2}
              />
            </IconWrapper>
          );
        })}
      </div>
      {count !== undefined ? (
        <span className={`text-xs font-bold ${countClassName}`}>
          {Number(value) > 0 ? `${Number(value).toFixed(1)} (${count})` : "No reviews yet"}
        </span>
      ) : null}
    </div>
  );
}
