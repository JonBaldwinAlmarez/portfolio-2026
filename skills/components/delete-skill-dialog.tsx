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
import { deleteSkill } from "@/features/skills/actions/skill-actions";
import type { Skill } from "@/features/skills/types";

type DeleteSkillDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill | null;
};

export function DeleteSkillDialog({
  open,
  onOpenChange,
  skill,
}: DeleteSkillDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    if (isPending) return; // don't close mid-request
    setError(null);
    onOpenChange(next);
  }

  function handleDelete() {
    if (!skill) return;
    setError(null);

    startTransition(async () => {
      const result = await deleteSkill(skill.id);
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
          <AlertDialogTitle>Delete this skill?</AlertDialogTitle>
          <AlertDialogDescription>
            {skill
              ? `"${skill.name}" will be removed from your portfolio. `
              : ""}
            This can`&apos;`t be undone.
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
