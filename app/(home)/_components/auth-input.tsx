"use client"

import { useState } from "react"
import {
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  error,
  value,
  onChange,
  showPasswordToggle = false,
  disabled = false,
}: {
  id: string
  label: string
  type?: string
  placeholder: string
  error?: string
  value: string
  onChange: (v: string) => void
  showPasswordToggle?: boolean
  disabled?: boolean
}) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-foreground/80 text-sm">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          className={cn(
            "h-11 rounded-xl bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-colors",
            error && "border-destructive/60 focus-visible:ring-destructive/40"
          )}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-destructive text-xs flex items-center gap-1 animate-slide-in">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}