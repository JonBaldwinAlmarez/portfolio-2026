"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/features/auth/actions/login";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/login-schema";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    form.clearErrors("root");

    startTransition(async () => {
      const result = await login(values);

      // On success the action redirects, so we only get here on failure
      if (result) {
        form.setError("root", { message: result.message });
        form.resetField("password");
      }
    });
  }

  const rootError = form.formState.errors.root?.message;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Admin login</CardTitle>
        <CardDescription>
          Sign in to manage your projects and skills.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="form-login" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                    className="min-h-11"
                    id="form-login-email"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                    className="min-h-11"
                    id="form-login-password"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-3">
        {rootError && (
          <p className="text-sm text-destructive" role="alert">
            {rootError}
          </p>
        )}
        <Button disabled={isPending} form="form-login" type="submit">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </CardFooter>
    </Card>
  );
}
