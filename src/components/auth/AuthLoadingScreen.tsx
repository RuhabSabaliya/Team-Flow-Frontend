'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function AuthLoadingScreen() {
  return (
        <div
          className="min-h-screen flex flex-col"
          style={{ background: 'var(--canvas)' }}
        >
          {/* Top bar skeleton */}
          <header
            className="h-14 flex items-center px-6 justify-between shrink-0"
            style={{ background: 'var(--topbar-bg)', borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-7 h-7 rounded-md" />
              <Skeleton className="w-20 h-4" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-56 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-24 h-8 rounded-md" />
            </div>
          </header>

              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar skeleton */}
                <div
                  className="w-56 shrink-0 p-4 space-y-3"
                  style={{ background: 'var(--nav-bg)', borderRight: '1px solid var(--nav-border)' }}
                >
                  <Skeleton className="w-24 h-3 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <Skeleton className="w-32 h-5 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <Skeleton className="w-20 h-3 rounded mt-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="w-full h-8 rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  ))}
                </div>

              {/* Main content skeleton */}
              <main
                className="flex-1 p-6 space-y-5"
                style={{ background: 'var(--canvas)' }}
              >
                <div className="space-y-2 max-w-sm">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-72" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <div
                        className="p-3"
                        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
                      >
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div
                        className="p-3 space-y-2.5"
                        style={{ background: 'var(--canvas-subtle)' }}
                      >
                        {[1, 2, 3, 4].map(j => (
                          <Skeleton key={j} className="h-20 w-full rounded-md" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </div>
        </div>
        );
}
