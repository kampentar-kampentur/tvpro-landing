import BlogClient from "./BlogClient";

export const metadata = {
  title: "TV Mounting & Home Theater Blog | TVPro",
  description: "Read TV mounting tips, home acoustics advice, cable concealment guides, and smart home updates from the certified installers at TVPro Handy Services.",
  alternates: {
    canonical: "https://tvprousa.com/blog/",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
