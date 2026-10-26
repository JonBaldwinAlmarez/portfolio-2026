import Hero from "@/features/home/components/Hero";
import AboutPreview from "@/features/home/components/About";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <AboutPreview />
    </main>
  );
}
