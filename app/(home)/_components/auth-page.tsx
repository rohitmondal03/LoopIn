"use client"

import { BrandingPanel } from "./branding-panel"
import { AuthForm } from "./auth-form"

export function AuthPage() {
  return (
    <div className="h-screen flex flex-col lg:flex-row items-center justify-center bg-background">
      {/* Left - Branding Panel (hidden on mobile) */}
      <div className="w-fit mx-auto flex-1">
        <BrandingPanel />
      </div>

      {/* Right - Auth Form */}
      <div className="flex flex-col items-center justify-center relative w-fit mx-auto flex-1">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-chart-2/3 rounded-full blur-3xl pointer-events-none" />

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4.5 w-4.5 text-primary"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="2" />
              <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M7.76 7.76a6 6 0 0 0 0 8.48" />
              <path d="M16.24 7.76a6 6 0 0 1 0 8.48" />
            </svg>
          </div>
          <span className="text-foreground font-semibold text-lg tracking-tight">LoopIn</span>
        </div>

        <AuthForm />
      </div>
    </div>
  )
}
