"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteSkillDialog } from "./delete-skill-dialog";
import { SkillFormDialog } from "@/features/skills/components/skill-form-dialog";
import type { Skill } from "@/features/skills/types";

function groupByCategory(skills: Skill[]): [string, Skill[]][] {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = groups.get(skill.category) ?? [];
    list.push(skill);
    groups.set(skill.category, list);
  }
  return [...groups.entries()];
}

export default function SkillsManager({ skills }: { skills: Skill[] }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Skill | null>(null);

  const groups = useMemo(() => groupByCategory(skills), [skills]);
  const categories = useMemo(() => groups.map(([name]) => name), [groups]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(skill: Skill) {
    setEditing(skill);
    setFormOpen(true);
  }

  function openDelete(skill: Skill) {
    setDeleting(skill);
    setDeleteOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Skills</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {skills.length} {skills.length === 1 ? "skill" : "skills"}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus aria-hidden="true" />
          Add skill
        </Button>
      </div>

      {groups.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No skills yet. Add your first one to get started.
        </p>
      ) : (
        <div className="mt-8 grid gap-8">
          {groups.map(([category, items]) => (
            <section aria-labelledby={`category-${category}`} key={category}>
              <h2
                className="text-sm font-medium text-muted-foreground"
                id={`category-${category}`}>
                {category}
              </h2>
              <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
                {items.map((skill) => (
                  <li
                    className="flex items-center justify-between gap-4 px-4 py-3"
                    key={skill.id}>
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        aria-label={`Edit ${skill.name}`}
                        onClick={() => openEdit(skill)}
                        size="icon"
                        variant="ghost">
                        <Pencil aria-hidden="true" />
                      </Button>
                      <Button
                        aria-label={`Delete ${skill.name}`}
                        onClick={() => openDelete(skill)}
                        size="icon"
                        variant="ghost">
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <SkillFormDialog
        categories={categories}
        onOpenChange={setFormOpen}
        open={formOpen}
        skill={editing}
      />
      <DeleteSkillDialog
        onOpenChange={setDeleteOpen}
        open={deleteOpen}
        skill={deleting}
      />
    </>
  );
}
