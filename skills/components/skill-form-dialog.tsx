"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SkillForm } from "@/features/skills/components/skill-form";
import type { Skill } from "@/features/skills/types";

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
