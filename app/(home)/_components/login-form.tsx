"use client"

import React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AuthInput } from "./auth-input"
import { login } from "@/lib/supabase/auth"

type FormState = "idle" | "loading" | "success" | "error"

interface FieldError {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
}

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formState, setFormState] = useState<FormState>("idle")
  const [errors, setErrors] = useState<FieldError>({})

  const validate = () => {
    const newErrors: FieldError = {}
    if (!email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address"
    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    if (!validate()) return

    setFormState("loading")

    await login(email, password)
      .then(() => {
        setFormState("success");
        toast.success("Login successful !!", {
          icon: "😎",
          style: {
            background: "white",
            color: "black"
          }
        })
      })
      .catch((error) => {
        if (error) {
          setFormState("error");
          toast.error("Cannot login !!", {
            description: error.message,
            icon: "😢",
            style: {
              background: "red",
              color: "white"
            }
          });
        }
      })
      .finally(() => {
        setFormState("idle")
      })
  }

  const isDisabled = formState === "loading" || formState === "success"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AuthInput
        id="login-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(v) => {
          setEmail(v)
          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
        }}
        error={errors.email}
        disabled={isDisabled}
      />
      <div className="flex flex-col gap-1.5">
        <AuthInput
          id="login-password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(v) => {
            setPassword(v)
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          error={errors.password}
          showPasswordToggle
          disabled={isDisabled}
        />
        <button
          type="button"
          className="text-xs text-primary hover:text-primary/80 transition-colors self-end mt-0.5"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={isDisabled}
        className={cn(
          "h-11 rounded-xl font-medium text-sm transition-all duration-200",
          formState === "success"
            ? "bg-emerald-600 hover:bg-emerald-600 text-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
        )}
      >
        {formState === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        {formState === "success" && <CheckCircle2 className="h-4 w-4" />}
        {formState === "loading"
          ? "Signing in..."
          : formState === "success"
            ? "Signed in!"
            : "Sign In"}
      </Button>
    </form>
  )
}