import Hero from "@/features/home/components/Hero";
import AboutPreview from "@/features/home/components/About";
import ProjectsSection from "@/features/projects/components/projects-section";
import ContactSection from "@/features/contact/components/contact-section";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
