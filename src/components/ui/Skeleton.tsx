import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

  export function Skeleton({ className, style, ...props }: SkeletonProps) {
    return (
      <div
        className={cn('animate-pulse rounded', className)}
        style={{ background: 'var(--surface-muted)', ...style }}
        {...props}
      />
    );
  }
