import LoginForm from "@/features/auth/components/login-form";
import React from "react";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-sm items-center">
      <div className="w-full">
        <h1 className="sr-only">Admin Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
