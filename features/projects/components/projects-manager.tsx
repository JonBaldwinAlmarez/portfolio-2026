"use client"; // Tells Next.js to run this component on the client.

import { useState } from "react"; // Provides local state for dialog and selected project values.
import { Pencil, Plus, Trash2 } from "lucide-react"; // Imports edit, create, and delete icons.
import { Button } from "@/components/ui/button"; // Imports the reusable button component.
import { DeleteProjectDialog } from "@/features/projects/components/delete-project-dialog"; // Imports the delete confirmation dialog.
import { ProjectFormDialog } from "@/features/projects/components/project-form-dialog"; // Imports the project form dialog.
import type { ProjectRecord } from "@/features/projects/types/project-record"; // Imports the project record type.

export default function ProjectsManager({
  projects,
}: {
  projects: ProjectRecord[];
}) {
  const [formOpen, setFormOpen] = useState(false); // Tracks whether the project form is open.
  const [editing, setEditing] = useState<ProjectRecord | null>(null); // Stores the project being edited.
  const [deleteOpen, setDeleteOpen] = useState(false); // Tracks whether the delete dialog is open.
  const [deleting, setDeleting] = useState<ProjectRecord | null>(null); // Stores the project being deleted.

  // Opens the form in create mode.
  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  // Opens the form with an existing project.
  function openEdit(project: ProjectRecord) {
    setEditing(project);
    setFormOpen(true);
  }

  // Opens the delete confirmation for a project.
  function openDelete(project: ProjectRecord) {
    setDeleting(project);
    setDeleteOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>

        <Button onClick={openCreate}>
          <Plus aria-hidden="true" />
          Add project
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No projects yet. Add your first one to get started.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border rounded-lg border border-border">
          {projects.map((project) => (
            <li
              className="flex items-center justify-between gap-4 px-4 py-4"
              key={project.id}
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{project.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  Image: {project.image}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  aria-label={`Edit ${project.title}`}
                  onClick={() => openEdit(project)}
                  size="icon"
                  variant="ghost"
                >
                  <Pencil aria-hidden="true" />
                </Button>
                <Button
                  aria-label={`Delete ${project.title}`}
                  onClick={() => openDelete(project)}
                  size="icon"
                  variant="ghost"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ProjectFormDialog
        onOpenChange={setFormOpen}
        open={formOpen}
        project={editing}
      />

      <DeleteProjectDialog
        onOpenChange={setDeleteOpen}
        open={deleteOpen}
        project={deleting}
      />
    </>
  );
}
