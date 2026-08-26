import styles from "./LoadingSkeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width, height, borderRadius, className = "" }: SkeletonProps) {
  return (
    <span
      className={[styles.skeleton, className].join(" ")}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className={styles.productCard} aria-hidden="true">
      <Skeleton height="100%" borderRadius="var(--radius-lg)" className={styles.image} />
      <div className={styles.info}>
        <Skeleton width="60%" height={12} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="40%" height={14} />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
