import Contacts from "@/blocks/Contacts/Contacts";

export const metadata = {
  title: "Contact Us | TVPro Handy Services",
  description: "Get in touch with TVPro Handy Services LLC. Reach us via phone, email, or view our location contacts for professional TV mounting.",
  alternates: {
    canonical: "https://tvprousa.com/contact/",
  },
};

export default function ContactPage() {
  return (
    <main style={{ padding: "40px 0" }}>
      <Contacts />
    </main>
  );
}
