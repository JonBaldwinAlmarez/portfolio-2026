import ContactForm from "@/features/contact/components/contact-form"; // Imports the contact form component.
import ContactServices from "@/features/contact/services/contact-services"; // Imports available contact methods.

export default function ContactSection() {
  // Renders the contact section and its contents.
  return (
    <section
      aria-labelledby="contact-heading"
      className="scroll-mt-20 border-t border-border/70 bg-muted/30"
      id="contact"
    >
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          {/* Introduces the contact heading. */}
          <p className="text-sm font-medium text-primary">Get in touch</p>
          <h2
            className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
            id="contact-heading"
          >
            Contact
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Have a question or an opportunity in mind? I’d be happy to hear from
            you.
          </p>
          <div className="mt-8">
            <ContactServices />
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
