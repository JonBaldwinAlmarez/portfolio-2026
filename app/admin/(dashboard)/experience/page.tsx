import { Suspense } from "react"; // Imports Suspense to handle components that load asynchronously.
import { connection } from "next/server"; // Imports connection to enable request-time rendering.
import { Button } from "@/components/ui/button"; // Imports the reusable Button component.
import { verifySession } from "@/features/auth/lib/verify-session"; // Imports the function that checks if the user is authenticated.
import {
  createExperience, // Imports the action for creating an experience.
  deleteExperience, // Imports the action for deleting an experience.
  updateExperience, // Imports the action for updating an experience.
} from "@/features/experience/actions/experience-actions";
import { getAdminExperiences } from "@/features/experience/queries/get-experiences"; // Imports the function that fetches experience records.

// Handles the content of the admin experience page.
async function ExperienceContent() {
  await connection(); // Enables request-time rendering before accessing user-specific data.
  await verifySession(); // Checks if the user is authenticated before showing the page.

  const experiences = await getAdminExperiences(); // Fetches all experience records from the database.

  return (
    <>
      {/* Displays the page heading. */}
      <h1 className="font-heading text-3xl font-semibold">Work Experience</h1>

      {/* Form for adding a new experience. */}
      <form action={createExperience} className="mt-8 grid max-w-xl gap-4">
        <h2 className="text-lg font-medium">Add experience</h2>
        <label className="grid gap-2 text-sm">
          Position
          <input
            className="min-h-11 rounded-md border bg-background px-3"
            name="position"
            required
          />
        </label>
        <label className="grid gap-2 text-sm">
          Hours
          <input
            className="min-h-11 rounded-md border bg-background px-3"
            min="1"
            name="hours"
            required
            type="number"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Company
          <input
            className="min-h-11 rounded-md border bg-background px-3"
            name="company"
            required
          />
        </label>
        <label className="grid gap-2 text-sm">
          Description
          <textarea
            className="min-h-32 rounded-md border bg-background p-3"
            name="description"
            required
          />
        </label>
        <Button type="submit">Add experience</Button>{" "}
        {/* Submits the form to create a new experience. */}
      </form>

      {/* Displays all existing experience records. */}
      <ul className="mt-10 grid gap-6">
        {experiences.map(
          (
            item, // Loops through each experience record.
          ) => (
            <li className="rounded-lg border p-5" key={item.id}>
              {" "}
              {/* Uses the record ID as a unique React key. */}
              {/* Form for updating an existing experience. */}
              <form action={updateExperience} className="grid gap-4">
                <input name="id" type="hidden" value={item.id} />{" "}
                {/* Sends the experience ID without displaying it. */}
                <label className="grid gap-2 text-sm">
                  Position
                  <input
                    className="min-h-11 rounded-md border bg-background px-3"
                    defaultValue={item.position}
                    name="position"
                    required
                  />{" "}
                  {/* Displays the current position as the default value. */}
                </label>
                <label className="grid gap-2 text-sm">
                  Hours
                  <input
                    className="min-h-11 rounded-md border bg-background px-3"
                    defaultValue={item.hours}
                    min="1"
                    name="hours"
                    required
                    type="number"
                  />{" "}
                  {/* Displays the current number of hours. */}
                </label>
                <label className="grid gap-2 text-sm">
                  Company
                  <input
                    className="min-h-11 rounded-md border bg-background px-3"
                    defaultValue={item.company}
                    name="company"
                    required
                  />{" "}
                  {/* Displays the current company name. */}
                </label>
                <label className="grid gap-2 text-sm">
                  Description
                  <textarea
                    className="min-h-32 rounded-md border bg-background p-3"
                    defaultValue={item.description}
                    name="description"
                    required
                  />{" "}
                  {/* Displays the current experience description. */}
                </label>
                <Button type="submit">Save changes</Button>{" "}
                {/* Submits the form to update the experience. */}
              </form>
              {/* Provides an expandable section for deleting the experience. */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-destructive">
                  Delete this experience
                </summary>

                {/* Form for deleting the selected experience. */}
                <form action={deleteExperience} className="mt-3">
                  <input name="id" type="hidden" value={item.id} />{" "}
                  {/* Sends the experience ID to identify which record to delete. */}
                  <Button type="submit" variant="destructive">
                    Confirm delete
                  </Button>
                </form>
              </details>
            </li>
          ),
        )}
      </ul>
    </>
  );
}

// Main component for the admin experience page.
export default function ExperiencePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <Suspense fallback={<p>Loading experience…</p>}>
        {" "}
        {/* Displays a loading message while ExperienceContent is loading. */}
        <ExperienceContent />
      </Suspense>
    </div>
  );
}
