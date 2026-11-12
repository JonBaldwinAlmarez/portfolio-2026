import React from "react";

export default function loading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="mt-4 h-4 w-64 animate-pulse rounded-md bg-muted" />
    </div>
  );
}
