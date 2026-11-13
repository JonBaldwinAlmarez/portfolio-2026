"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page couldn`&apos;`t load. Try again, and check the server logs if
        it keeps happening.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
