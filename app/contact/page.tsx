import ContactForm from "@/features/contact/components/contact-form";
import ContactServices from "@/features/contact/services/contact-services";

export default function ContactPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto grid w-full max-w-5xl gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-primary">Get in touch</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Contact
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Have a question or an opportunity in mind? Add your preferred
            contact details and form provider to get started.
          </p>
          <div className="mt-8">
            <ContactServices />
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
