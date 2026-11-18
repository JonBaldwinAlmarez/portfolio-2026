"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  createProject,
  updateProject,
} from "@/features/projects/actions/project-actions";
import {
  projectSchema,
  type ProjectInput,
} from "@/features/projects/schema/project-schema";
import type { ProjectRecord } from "@/features/projects/types/project-record";

type ProjectFormProps = {
  project: ProjectRecord | null;
  onDone: () => void;
  onCancel: () => void;
};

export function ProjectForm({ project, onDone, onCancel }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      technologies: project?.technologies.join(", ") ?? "",
      image: project?.image ?? "",
      href: project?.href ?? "",
      github: project?.github ?? "",
    },
  });

  function onSubmit(values: ProjectInput) {
    form.clearErrors("root");

    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, values)
        : await createProject(values);

      if (result.ok) {
        onDone();
      } else {
        form.setError("root", { message: result.message });
      }
    });
  }

  const errors = form.formState.errors;
  const rootError = errors.root?.message;

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="project-title">Title</FieldLabel>
          <Input
            {...form.register("title")}
            aria-invalid={!!errors.title}
            autoComplete="off"
            className="min-h-11"
            id="project-title"
            placeholder="Project name"
          />
          {errors.title && <FieldError errors={[errors.title]} />}
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="project-description">Description</FieldLabel>
          <textarea
            {...form.register("description")}
            aria-invalid={!!errors.description}
            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            id="project-description"
            placeholder="What does this project do?"
            rows={4}
          />
          {errors.description && <FieldError errors={[errors.description]} />}
        </Field>

        <Field data-invalid={!!errors.technologies}>
          <FieldLabel htmlFor="project-technologies">Technologies</FieldLabel>
          <textarea
            {...form.register("technologies")}
            aria-invalid={!!errors.technologies}
            className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            id="project-technologies"
            placeholder={"React, TypeScript, Supabase\nTailwind CSS"}
            rows={3}
          />
          <p className="text-sm text-muted-foreground">
            Separate technologies with commas or new lines.
          </p>
          {errors.technologies && <FieldError errors={[errors.technologies]} />}
        </Field>

        <Field data-invalid={!!errors.image}>
          <FieldLabel htmlFor="project-image">Image path or URL</FieldLabel>
          <Input
            {...form.register("image")}
            aria-invalid={!!errors.image}
            autoComplete="off"
            className="min-h-11"
            id="project-image"
            placeholder="/images/projects/my-project.png"
          />
          {errors.image && <FieldError errors={[errors.image]} />}
        </Field>

        <Field data-invalid={!!errors.href}>
          <FieldLabel htmlFor="project-live-url">
            Live URL (optional)
          </FieldLabel>
          <Input
            {...form.register("href")}
            aria-invalid={!!errors.href}
            autoComplete="url"
            className="min-h-11"
            id="project-live-url"
            placeholder="https://example.com"
            type="url"
          />
          {errors.href && <FieldError errors={[errors.href]} />}
        </Field>

        <Field data-invalid={!!errors.github}>
          <FieldLabel htmlFor="project-github-url">
            GitHub URL (optional)
          </FieldLabel>
          <Input
            {...form.register("github")}
            aria-invalid={!!errors.github}
            autoComplete="url"
            className="min-h-11"
            id="project-github-url"
            placeholder="https://github.com/username/repository"
            type="url"
          />
          {errors.github && <FieldError errors={[errors.github]} />}
        </Field>
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
          {isPending ? "Saving..." : project ? "Save changes" : "Add project"}
        </Button>
      </DialogFooter>
    </form>
  );
}
