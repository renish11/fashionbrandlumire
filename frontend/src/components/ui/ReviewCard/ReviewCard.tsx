import { Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { ProductReview } from "@/types";
import styles from "./ReviewCard.module.css";

interface ReviewCardProps {
  review: ProductReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar} aria-hidden="true">
          {review.author.charAt(0).toUpperCase()}
        </div>
        <div className={styles.meta}>
          <div className={styles.authorRow}>
            <span className={styles.author}>{review.author}</span>
            {review.verified && (
              <Badge variant="success">Verified</Badge>
            )}
          </div>
          <div className={styles.ratingRow} aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < review.rating ? "currentColor" : "none"}
                className={[styles.star, i < review.rating ? styles.starFilled : styles.starEmpty].join(" ")}
                aria-hidden="true"
              />
            ))}
            <time className={styles.date} dateTime={review.date}>
              {new Date(review.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </div>

      <h4 className={styles.title}>{review.title}</h4>
      <p className={styles.body}>{review.body}</p>
    </article>
  );
}
