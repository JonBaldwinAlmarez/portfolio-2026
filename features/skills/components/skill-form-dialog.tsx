"use client"; // Tells Next.js to run this dialog on the client.

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Imports dialog layout components.
import { SkillForm } from "@/features/skills/components/skill-form"; // Imports the skill form.
import type { Skill } from "@/features/skills/types"; // Imports the skill record type.

type SkillFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill | null;
  categories: string[];
};

export function SkillFormDialog({
  open,
  onOpenChange,
  skill,
  categories,
}: SkillFormDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skill ? "Edit skill" : "Add skill"}</DialogTitle>
          <DialogDescription>
            {skill
              ? "Update the name or category."
              : "Add a skill to show on your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <SkillForm
          categories={categories}
          key={skill?.id ?? "new"}
          onCancel={() => onOpenChange(false)}
          onDone={() => onOpenChange(false)}
          skill={skill}
        />
      </DialogContent>
    </Dialog>
  );
}
