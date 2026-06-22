import { Suspense } from "react";
import { getAllBlogPosts, getStrapiMediaUrl } from "@/lib/strapi";
import { blogPosts as mockPosts } from "@/lib/blog-data";
import BlogClient from "../../BlogClient";
import styles from "../../blog.module.css";

const slugify = (text) => {
  if (!text) return "";
  return text.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
};

// Retrieve all categories from both Strapi and mock data
async function getCategories() {
  const strapiPosts = await getAllBlogPosts();
  const allPosts = [...strapiPosts, ...mockPosts];
  const uniqueCategories = [...new Set(allPosts.map(p => p.category).filter(Boolean))];
  
  return uniqueCategories.map(cat => ({
    name: cat,
    slug: slugify(cat)
  }));
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(cat => ({
    slug: cat.slug
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === slug);
  const categoryName = category ? category.name : "Category";

  return {
    title: `${categoryName} - TV Mounting & Home Theater Blog | TVPro`,
    description: `Read expert tips, installation guides, and professional advice relating to ${categoryName.toLowerCase()} on the TVPro blog.`,
    alternates: {
      canonical: `https://tvprousa.com/blog/category/${slug}/`,
    },
  };
}

export default async function BlogCategoryPage({ params }) {
  const { slug } = params;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === slug);
  const categoryName = category ? category.name : "General";

  const strapiPosts = await getAllBlogPosts();

  // Normalize only the posts that belong to the active category
  const normalizedStrapiPosts = strapiPosts
    .filter(post => slugify(post.category || "General") === slug)
    .map(post => {
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

  return (
    <Suspense fallback={<div className={styles.loading}>Loading category...</div>}>
      <BlogClient initialPosts={normalizedStrapiPosts} category={categoryName} />
    </Suspense>
  );
}
