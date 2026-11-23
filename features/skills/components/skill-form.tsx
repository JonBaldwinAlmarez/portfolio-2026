"use client"; // Tells Next.js to run this form on the client.

import { useTransition } from "react"; // Provides pending state and transition handling.
import { zodResolver } from "@hookform/resolvers/zod"; // Connects the form to Zod validation.
import { Controller, useForm } from "react-hook-form"; // Provides controlled form fields and state.
import { Button } from "@/components/ui/button"; // Imports the reusable button component.
import { DialogFooter } from "@/components/ui/dialog"; // Imports dialog footer layout.
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"; // Imports form field layout components.
import { Input } from "@/components/ui/input"; // Imports the reusable input component.
import {
  createSkill,
  updateSkill,
} from "@/features/skills/actions/skill-actions"; // Imports skill create and update actions.
import { skillSchema, type SkillInput } from "../schema/skill-schema"; // Imports skill validation rules and types.
import type { Skill } from "@/features/skills/types"; // Imports the skill record type.

type SkillFormProps = {
  skill: Skill | null; // null = creating, a skill = editing
  categories: string[]; // existing categories, offered as suggestions
  onDone: () => void;
  onCancel: () => void;
};

export function SkillForm({
  skill,
  categories,
  onDone,
  onCancel,
}: SkillFormProps) {
  const [isPending, startTransition] = useTransition(); // Tracks whether saving is in progress.

  const form = useForm<SkillInput>({
    resolver: zodResolver(skillSchema), // Validates values using the skill schema.
    defaultValues: {
      name: skill?.name ?? "", // Populates or initializes the skill name.
      category: skill?.category ?? "", // Populates or initializes the category.
    },
  });

  function onSubmit(values: SkillInput) {
    form.clearErrors("root"); // Clears the previous form-level error.

    startTransition(async () => {
      const result = skill
        ? await updateSkill(skill.id, values) // Updates an existing skill.
        : await createSkill(values); // Creates a new skill.

      if (result.ok) {
        onDone();
      } else {
        form.setError("root", { message: result.message }); // Displays the action error.
      }
    });
  }

  const rootError = form.formState.errors.root?.message;

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="skill-name">Name</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                className="min-h-11"
                id="skill-name"
                placeholder="TypeScript"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="skill-category">Category</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                className="min-h-11"
                id="skill-category"
                list="skill-categories"
                placeholder="Frontend"
              />
              <datalist id="skill-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {rootError && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {rootError}
        </p>
      )}

      <DialogFooter className="mt-6">
        <Button onClick={onCancel} type="button" variant="outline">
          Cancel
        </Button>
        <Button disabled={isPending} type="submit">
          {isPending ? "Saving..." : skill ? "Save changes" : "Add skill"}
        </Button>
      </DialogFooter>
    </form>
  );
}
