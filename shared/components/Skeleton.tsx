
import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass p-4 rounded-2xl border border-white/5 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
