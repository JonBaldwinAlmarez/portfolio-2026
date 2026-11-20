import { getPublicExperiences } from "@/features/experience/queries/get-experiences"; // Imports the function that fetches public experience records.

// Displays the work experience section on the public website.
export default async function ExperienceSection() {
  const experience = await getPublicExperiences(); // Fetches experience records from the database.

  return (
    <section aria-labelledby="experience-heading">
      {" "}
      {/* Groups the work experience content and connects it to its heading. */}
      <h3
        className="font-heading text-xl font-semibold tracking-tight"
        id="experience-heading">
        Work Experience
      </h3>
      {/* Checks if there are any experience records to display. */}
      {experience.length > 0 ? (
        <ol className="mt-6 grid gap-6">
          {experience.map(
            (
              item, // Loops through each experience record.
            ) => (
              <li className="border-l-2 border-primary/30 pl-5" key={item.id}>
                {" "}
                {/* Uses the record ID as a unique React key. */}
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-medium">{item.position}</h4>{" "}
                  {/* Displays the job position. */}
                  <p className="text-sm text-muted-foreground">
                    {item.hours} hours {/* Displays the number of hours. */}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.company} {/* Displays the company name. */}
                </p>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {item.description}{" "}
                  {/* Displays the experience description. */}
                </p>
              </li>
            ),
          )}
        </ol>
      ) : (
        // Displays a message when there are no experience records.
        <p className="mt-4 text-muted-foreground">
          No work experience has been added yet.
        </p>
      )}
    </section>
  );
}
