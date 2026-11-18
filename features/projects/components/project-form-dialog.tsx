"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm } from "@/features/projects/components/project-form";
import type { ProjectRecord } from "@/features/projects/types/project-record";

type ProjectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectRecord | null;
};

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
}: ProjectFormDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit project" : "Add project"}</DialogTitle>
          <DialogDescription>
            {project
              ? "Update this project’s details."
              : "Add a project to your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <ProjectForm
          key={project?.id ?? "new"}
          onCancel={() => onOpenChange(false)}
          onDone={() => onOpenChange(false)}
          project={project}
        />
      </DialogContent>
    </Dialog>
  );
}
