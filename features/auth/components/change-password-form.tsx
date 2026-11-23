"use client"; // Tells Next.js to run this component on the client.

import { useTransition } from "react"; // Provides pending state and transition handling.
import { zodResolver } from "@hookform/resolvers/zod"; // Connects the form to Zod validation.
import { Controller, useForm } from "react-hook-form"; // Provides form state and controlled fields.
import { Button } from "@/components/ui/button"; // Imports the reusable button component.
import {
  Card,
  CardContent,
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
import { changePassword } from "@/features/auth/actions/change-password"; // Imports the password change server action.
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/features/auth/schemas/change-password-schema"; // Imports validation rules and form value types.

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition(); // Tracks whether the password change is in progress.

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema), // Validates values using the password change schema.
    defaultValues: {
      currentPassword: "", // Starts the current password field empty.
      newPassword: "", // Starts the new password field empty.
      confirmPassword: "", // Starts the confirmation field empty.
    },
  });

  function onSubmit(values: ChangePasswordInput) {
    form.clearErrors("root"); // Clears the previous form-level message.

    startTransition(async () => {
      const result = await changePassword(values); // Sends the submitted passwords to the server action.

      if (result.ok) {
        form.reset(); // Clears all fields after a successful password change.
      }

      form.setError("root", { message: result.message }); // Displays the success or error message.
    });
  }

  const rootError = form.formState.errors.root?.message; // Reads the form-level message for display.

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          id="form-change-password"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            {/* Collect the current password. */}
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="current-password">
                    Current password
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                    className="min-h-11"
                    id="current-password"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Collect the new password. */}
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-password">New password</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                    className="min-h-11"
                    id="new-password"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Collect the confirmation password. */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm new password
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                    className="min-h-11"
                    id="confirm-password"
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
          <p
            className={
              rootError === "Password changed successfully."
                ? "text-sm text-green-600"
                : "text-sm text-destructive"
            }
            role="alert"
          >
            {rootError}
          </p>
        )}

        <Button disabled={isPending} form="form-change-password" type="submit">
          {isPending ? "Changing..." : "Change password"}
        </Button>
      </CardFooter>
    </Card>
  );
}
