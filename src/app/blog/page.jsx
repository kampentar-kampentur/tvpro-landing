import { Suspense } from "react";
import { getAllBlogPosts, getAllCities, getStrapiMediaUrl } from "@/lib/strapi";
import { blogPosts } from "@/lib/blog-data";
import BlogClient from "./BlogClient";
import styles from "./blog.module.css";

export const metadata = {
  title: "TV Mounting & Home Theater Blog | TVPro",
  description: "Read TV mounting tips, home acoustics advice, cable concealment guides, and smart home updates from the certified installers at TVPro Handy Services.",
  alternates: {
    canonical: "https://tvprousa.com/blog/",
  },
  openGraph: {
    title: "TV Mounting & Home Theater Blog | TVPro",
    description: "Read TV mounting tips, home acoustics advice, cable concealment guides, and smart home updates from the certified installers at TVPro Handy Services.",
    type: "website",
    url: "https://tvprousa.com/blog/",
    images: [{ url: "https://tvprousa.com/og-image.png", width: 1200, height: 630, alt: "TVPro Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TV Mounting & Home Theater Blog | TVPro",
    description: "Read TV mounting tips, home acoustics advice, cable concealment guides, and smart home updates from the certified installers at TVPro Handy Services.",
    images: ["https://tvprousa.com/og-image.png"],
  },
};

export default async function BlogPage() {
  const strapiPosts = await getAllBlogPosts();
  
  let cities = [];
  try {
    cities = await getAllCities();
  } catch (error) {
    console.error("[Blog Page] Failed to fetch cities:", error);
  }

  const activeCities = cities
    .filter(city => !city.test_version && city.path && !city.metro_city_slug)
    .map(city => ({
      name: city.city_name,
      state: city.state_code,
      path: city.path
    }))
    .slice(0, 8);

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
      coverMedia: post.cover || { url: "/blog-placeholder.jpg" },
      featured: !!post.featured,
      author: {
        name: post.author?.name || "TVPro Specialist",
        role: post.author?.role || "Certified Installer",
        avatar: post.author?.avatar?.url ? getStrapiMediaUrl(post.author.avatar.url) : "/author-placeholder.jpg",
        avatarMedia: post.author?.avatar || { url: "/author-placeholder.jpg" }
      }
    };
  });

  const POSTS_PER_PAGE = 9;

  // Calculate total pages based on merged list
  const posts = [...normalizedStrapiPosts];
  for (const mock of blogPosts) {
    if (!posts.find(p => p.slug === mock.slug)) {
      posts.push(mock);
    }
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const featuredPost = normalizedStrapiPosts.find(p => p.featured) || normalizedStrapiPosts[0];
  const featuredImageUrl = featuredPost?.image;

  return (
    <>
      {featuredImageUrl && (
        <link rel="preload" as="image" href={featuredImageUrl} fetchPriority="high" />
      )}
      <Suspense fallback={<div className={styles.loading}>Loading blog...</div>}>
        <BlogClient 
          initialPosts={normalizedStrapiPosts} 
          cities={activeCities} 
          currentPage={1}
          totalPages={totalPages}
          postsPerPage={POSTS_PER_PAGE}
        />
      </Suspense>
    </>
  );
}
