"use client"; // Tells Next.js to run this component on the client.

import { useTransition } from "react"; // Provides pending state and transition handling.
import { zodResolver } from "@hookform/resolvers/zod"; // Connects the form to Zod validation.
import { Controller, useForm } from "react-hook-form"; // Provides form state and controlled fields.
import { Button } from "@/components/ui/button"; // Imports the reusable button component.
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Imports card layout components.
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"; // Imports form field layout components.
import { Input } from "@/components/ui/input"; // Imports the reusable input component.
import { login } from "@/features/auth/actions/login"; // Imports the login server action.
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/login-schema"; // Imports validation rules and form value types.

export default function LoginForm() {
  const [isPending, startTransition] = useTransition(); // Tracks whether the login request is in progress.

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema), // Validates values using the login schema.
    defaultValues: { email: "", password: "" }, // Starts both login fields empty.
  });

  function onSubmit(values: LoginInput) {
    form.clearErrors("root"); // Clears the previous form-level error.

    startTransition(async () => {
      const result = await login(values); // Sends the submitted credentials to the server action.

      // On success the action redirects, so we only get here on failure.
      if (result) {
        form.setError("root", { message: result.message }); // Displays the login error.
        form.resetField("password"); // Clears the password after a failed login.
      }
    });
  }

  const rootError = form.formState.errors.root?.message; // Reads the form-level error for display.

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
            {/* Collect the account email. */}
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

            {/* Collect the account password. */}
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
