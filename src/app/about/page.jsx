import AboutUs from "@/blocks/AboutUs/AboutUs";

export const metadata = {
  title: "About Us | TVPro Handy Services",
  description: "Learn more about TVPro Handy Services LLC, our professional TV mounting, home theater installation, and handyman services history and values.",
  alternates: {
    canonical: "https://tvprousa.com/about/",
  },
};

export default function AboutPage() {
  return (
    <main style={{ padding: "40px 0" }}>
      <AboutUs />
    </main>
  );
}
