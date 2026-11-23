"use client"; // Tells Next.js to run this dialog on the client.

import { useState, useTransition } from "react"; // Provides local error state and pending transition handling.
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Imports confirmation dialog components.
import { Button } from "@/components/ui/button"; // Imports the reusable button component.
import { deleteProject } from "@/features/projects/actions/project-actions"; // Imports the delete project server action.
import type { ProjectRecord } from "@/features/projects/types/project-record"; // Imports the project record type.

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
  const [isPending, startTransition] = useTransition(); // Tracks whether deletion is in progress.
  const [error, setError] = useState<string | null>(null); // Stores deletion error messages.

  // Closes the dialog or clears errors when it opens or closes.
  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setError(null);
    onOpenChange(next);
  }

  // Deletes the selected project and reports the result.
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
            variant="destructive"
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
