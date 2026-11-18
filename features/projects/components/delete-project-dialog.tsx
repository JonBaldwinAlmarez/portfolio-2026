"use client";

import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteProject } from "@/features/projects/actions/project-actions";
import type { ProjectRecord } from "@/features/projects/types/project-record";

type DeleteProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectRecord | null;
};

export function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
}: DeleteProjectDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setError(null);
    onOpenChange(next);
  }

  function handleDelete() {
    if (!project) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteProject(project.id);

      if (result.ok) {
        onOpenChange(false);
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            {project ? `"${project.title}" will be removed. ` : ""}
            This action can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={handleDelete}
            variant="destructive">
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
