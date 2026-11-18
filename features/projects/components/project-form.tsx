"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createProject,
  updateProject,
} from "@/features/projects/actions/project-actions";
import {
  projectFormSchema,
  projectSchema,
  type ProjectFormValues,
} from "@/features/projects/schema/project-schema";
import type { ProjectRecord } from "@/features/projects/types/project-record";
import { createClient } from "@/lib/supabase/client";

const IMAGE_BUCKET = "project-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type ProjectFormProps = {
  project: ProjectRecord | null;
  onDone: () => void;
  onCancel: () => void;
};

function getImageError(file: File): string | null {
  if (!IMAGE_EXTENSIONS[file.type]) {
    return "Choose a JPG, PNG, WebP, or AVIF image.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be 5 MB or smaller.";
  }

  return null;
}

async function removeFailedUpload(
  supabase: ReturnType<typeof createClient>,
  path: string,
): Promise<string> {
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .remove([path]);

  if (error) {
    console.error("Could not remove failed project image upload:", error);
    return " The uploaded image could not be removed from Storage.";
  }

  return "";
}

export function ProjectForm({ project, onDone, onCancel }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      technologies: project?.technologies.join(", ") ?? "",
      image: project?.image ?? "",
      href: project?.href ?? "",
      github: project?.github ?? "",
    },
  });
  const storedImage = useWatch({ control: form.control, name: "image" });

  useEffect(
    () => () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    },
    [],
  );

  function chooseFile(file: File | undefined) {
    if (!file) return;

    const error = getImageError(file);
    if (error) {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setFilePreviewUrl(null);
      setSelectedFile(null);
      setImageError(error);
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = URL.createObjectURL(file);
    setFilePreviewUrl(previewUrlRef.current);
    setSelectedFile(file);
    setImageError(null);
  }

  function onSubmit(values: ProjectFormValues) {
    form.clearErrors("root");

    if (imageError) return;

    if (!selectedFile && !values.image.trim()) {
      setImageError("Choose a project image.");
      return;
    }

    setImageError(null);

    startTransition(async () => {
      let image = values.image.trim();
      let uploadedPath: string | null = null;
      let supabase: ReturnType<typeof createClient> | null = null;

      if (selectedFile) {
        const extension = IMAGE_EXTENSIONS[selectedFile.type];
        if (!extension) {
          setImageError("Choose a JPG, PNG, WebP, or AVIF image.");
          return;
        }

        supabase = createClient();
        uploadedPath = `projects/${crypto.randomUUID()}.${extension}`;

        const { error } = await supabase.storage
          .from(IMAGE_BUCKET)
          .upload(uploadedPath, selectedFile, {
            cacheControl: "31536000",
            contentType: selectedFile.type,
            upsert: false,
          });

        if (error) {
          console.error("Project image upload failed:", error);
          form.setError("root", {
            message:
              "Could not upload the image. Check the Supabase Storage bucket and upload policy.",
          });
          return;
        }

        image = supabase.storage
          .from(IMAGE_BUCKET)
          .getPublicUrl(uploadedPath).data.publicUrl;
      }

      const parsed = projectSchema.safeParse({ ...values, image });
      if (!parsed.success) {
        const cleanupMessage =
          uploadedPath && supabase
            ? await removeFailedUpload(supabase, uploadedPath)
            : "";
        form.setError("root", {
          message: `Please check the form and try again.${cleanupMessage}`,
        });
        return;
      }

      const result = project
        ? await updateProject(project.id, parsed.data)
        : await createProject(parsed.data);

      if (!result.ok) {
        const cleanupMessage =
          uploadedPath && supabase
            ? await removeFailedUpload(supabase, uploadedPath)
            : "";
        form.setError("root", {
          message: `${result.message}${cleanupMessage}`,
        });
        return;
      }

      onDone();
    });
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files.item(0) ?? undefined);
  }

  const errors = form.formState.errors;
  const rootError = errors.root?.message;
  const currentImage = filePreviewUrl ?? storedImage;

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="project-title">Title (required)</FieldLabel>
          <Input
            {...form.register("title")}
            aria-invalid={!!errors.title}
            autoComplete="off"
            className="min-h-11"
            id="project-title"
            placeholder="Project name"
            required
          />
          {errors.title && <FieldError errors={[errors.title]} />}
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="project-description">
            Description (required)
          </FieldLabel>
          <Textarea
            {...form.register("description")}
            aria-invalid={!!errors.description}
            id="project-description"
            placeholder="What does this project do?"
            required
            rows={4}
          />
          {errors.description && <FieldError errors={[errors.description]} />}
        </Field>

        <Field data-invalid={!!errors.technologies}>
          <FieldLabel htmlFor="project-technologies">
            Technologies (required)
          </FieldLabel>
          <Textarea
            {...form.register("technologies")}
            aria-invalid={!!errors.technologies}
            id="project-technologies"
            placeholder={"React, TypeScript, Supabase\nTailwind CSS"}
            required
            rows={3}
          />
          <p className="text-sm text-muted-foreground">
            Separate technologies with commas or new lines.
          </p>
          {errors.technologies && (
            <FieldError errors={[errors.technologies]} />
          )}
        </Field>

        <Field data-invalid={!!imageError}>
          <FieldLabel htmlFor="project-image">
            Project image (required)
          </FieldLabel>
          <input {...form.register("image")} type="hidden" />
          <input
            accept="image/avif,image/jpeg,image/png,image/webp"
            className="sr-only"
            id="project-image"
            onChange={(event) => {
              chooseFile(event.currentTarget.files?.[0]);
              event.currentTarget.value = "";
            }}
            ref={fileInputRef}
            type="file"
          />
          <div
            className={`rounded-lg border border-dashed p-5 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDrop={handleDrop}>
            {currentImage ? (
              <div className="mx-auto mb-4 aspect-video max-w-sm overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Selected project preview"
                  className="h-full w-full object-cover"
                  src={currentImage}
                />
              </div>
            ) : (
              <p className="mb-3 text-sm text-muted-foreground">
                Drag an image here, or choose a file.
              </p>
            )}
            {selectedFile && (
              <p className="mb-3 text-sm text-muted-foreground">
                {selectedFile.name}
              </p>
            )}
            <Button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              variant="outline">
              {currentImage ? "Choose a different image" : "Choose image"}
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              JPG, PNG, WebP, or AVIF. Maximum size: 5 MB.
            </p>
          </div>
          {imageError && (
            <p className="text-sm text-destructive" role="alert">
              {imageError}
            </p>
          )}
        </Field>

        <Field data-invalid={!!errors.href}>
          <FieldLabel htmlFor="project-live-url">
            Live URL (required)
          </FieldLabel>
          <Input
            {...form.register("href")}
            aria-invalid={!!errors.href}
            autoComplete="url"
            className="min-h-11"
            id="project-live-url"
            placeholder="https://example.com"
            required
            type="url"
          />
          {errors.href && <FieldError errors={[errors.href]} />}
        </Field>

        <Field data-invalid={!!errors.github}>
          <FieldLabel htmlFor="project-github-url">
            GitHub URL (required)
          </FieldLabel>
          <Input
            {...form.register("github")}
            aria-invalid={!!errors.github}
            autoComplete="url"
            className="min-h-11"
            id="project-github-url"
            placeholder="https://github.com/username/repository"
            required
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
        <Button
          disabled={isPending}
          onClick={onCancel}
          type="button"
          variant="outline">
          Cancel
        </Button>
        <Button disabled={isPending} type="submit">
          {isPending ? "Saving..." : project ? "Save changes" : "Add project"}
        </Button>
      </DialogFooter>
    </form>
  );
}
