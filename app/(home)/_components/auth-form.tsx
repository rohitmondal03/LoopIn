"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LoginForm } from "./login-form"
import { SignUpForm } from "./signup-form"

export function AuthForm() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="border-2 border-white/30 rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col gap-1.5 mb-6">
          <h2 className="text-3xl font-bold text-foreground">Welcome</h2>
          <p className="text-muted-foreground text-sm">
            Sign in to start watching with friends
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full rounded-xl bg-secondary/50 h-10 p-1 mb-5">
            <TabsTrigger
              value="login"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
