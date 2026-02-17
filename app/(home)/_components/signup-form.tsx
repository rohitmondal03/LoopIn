"use client"

import { useRouter } from 'next/navigation'
import { useState } from "react"
import {
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AuthInput } from "./auth-input"
import { signUp } from "@/lib/supabase/auth"
import { toast } from 'sonner'

type FormState = "idle" | "loading" | "success" | "error"

interface FieldError {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
}

export function SignUpForm() {
  const { push } = useRouter();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formState, setFormState] = useState<FormState>("idle")
  const [errors, setErrors] = useState<FieldError>({})

  const validate = () => {
    const newErrors: FieldError = {}
    if (!name.trim()) newErrors.name = "Full name is required"
    if (!email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address"
    if (!password) newErrors.password = "Password is required"
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters"
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password"
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    if (!validate()) return

    setFormState("loading")

    await signUp(email, password, name)
      .then(() => {
        setFormState("success");
        toast.success("Acocunt created successfully !!", {
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
          toast.error("An error occured while creating your account !!", {
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
  const clearError = (field: keyof FieldError) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AuthInput
        id="signup-name"
        label="Full Name"
        placeholder="John Doe"
        value={name}
        onChange={(v) => {
          setName(v)
          if (errors.name) clearError("name")
        }}
        error={errors.name}
        disabled={isDisabled}
      />
      <AuthInput
        id="signup-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(v) => {
          setEmail(v)
          if (errors.email) clearError("email")
        }}
        error={errors.email}
        disabled={isDisabled}
      />
      <AuthInput
        id="signup-password"
        label="Password"
        placeholder="Create a password"
        value={password}
        onChange={(v) => {
          setPassword(v)
          if (errors.password) clearError("password")
        }}
        error={errors.password}
        showPasswordToggle
        disabled={isDisabled}
      />
      <AuthInput
        id="signup-confirm"
        label="Confirm Password"
        placeholder="Repeat your password"
        value={confirmPassword}
        onChange={(v) => {
          setConfirmPassword(v)
          if (errors.confirmPassword) clearError("confirmPassword")
        }}
        error={errors.confirmPassword}
        showPasswordToggle
        disabled={isDisabled}
      />

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
          ? "Creating account..."
          : formState === "success"
            ? "Account created!"
            : "Create Account"}
      </Button>

      <p className="text-muted-foreground text-xs text-center leading-relaxed">
        {"By signing up, you agree to our "}
        <button type="button" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2">
          Terms of Service
        </button>
        {" and "}
        <button type="button" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2">
          Privacy Policy
        </button>
        .
      </p>
    </form>
  )
}