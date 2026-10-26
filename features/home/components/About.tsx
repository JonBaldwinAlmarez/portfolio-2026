import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="border-y border-border/70 bg-muted/30">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <p className="text-sm font-medium text-primary">About</p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight">
          A little about me
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Add a short biography here. Share your focus, interests, and what you
          are looking for next.
        </p>
        <Link
          className="mt-6 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
          href="/about"
        >
          More about me <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
