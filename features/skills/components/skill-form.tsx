"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createSkill,
  updateSkill,
} from "@/features/skills/actions/skill-actions";
import { skillSchema, type SkillInput } from "../schema/skill-schema";
import type { Skill } from "@/features/skills/types";

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
  const [isPending, startTransition] = useTransition();

  const form = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "",
    },
  });

  function onSubmit(values: SkillInput) {
    form.clearErrors("root");

    startTransition(async () => {
      const result = skill
        ? await updateSkill(skill.id, values)
        : await createSkill(values);

      if (result.ok) {
        onDone();
      } else {
        form.setError("root", { message: result.message });
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
