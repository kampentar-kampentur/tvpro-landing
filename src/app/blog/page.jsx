import { getAllBlogPosts, getStrapiMediaUrl } from "@/lib/strapi";
import BlogClient from "./BlogClient";

export const metadata = {
  title: "TV Mounting & Home Theater Blog | TVPro",
  description: "Read TV mounting tips, home acoustics advice, cable concealment guides, and smart home updates from the certified installers at TVPro Handy Services.",
  alternates: {
    canonical: "https://tvprousa.com/blog/",
  },
};

export default async function BlogPage() {
  const strapiPosts = await getAllBlogPosts();

  const normalizedStrapiPosts = strapiPosts.map(post => {
    const formattedDate = post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "";

    return {
      id: post.id || post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category || "General",
      date: formattedDate || post.date || "",
      readTime: post.readTime ? `${post.readTime} min read` : "5 min read",
      image: post.cover?.url ? getStrapiMediaUrl(post.cover.url) : "/blog-placeholder.jpg",
      featured: !!post.featured,
      author: {
        name: post.author?.name || "TVPro Specialist",
        role: post.author?.role || "Certified Installer",
        avatar: post.author?.avatar?.url ? getStrapiMediaUrl(post.author.avatar.url) : "/author-placeholder.jpg"
      }
    };
  });

  return <BlogClient initialPosts={normalizedStrapiPosts} />;
}
