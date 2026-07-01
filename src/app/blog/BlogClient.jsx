"use client";
 
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, blogPosts } from "@/lib/blog-data";
import Button from "@/ui/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import SEOBreadcrumbs from "@/ui/SEOBreadcrumbs/SEOBreadcrumbs";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import styles from "./blog.module.css";

const promoOffers = {
  "TV Mounting": {
    title: "Need Professional TV Mounting?",
    description: "Connect with certified local technicians to mount your TV safely on any wall type.",
    usp: "Background-checked & fully insured technicians.",
    cta: "Request TV Mounting",
    modal: "BookNow"
  },
  "Home Theater": {
    title: "Upgrade Your Home Theater",
    description: "Get surround sound installation, soundbar mounting, projector setup, or calibration services.",
    usp: "Premium equipment setup and testing.",
    cta: "Request Audio Setup",
    modal: "BookNow"
  },
  "Smart Home": {
    title: "Smart Home Installation",
    description: "Have your smart doorbell, thermostat, cameras, or smart hubs installed by professionals.",
    usp: "Seamless connection and app setup.",
    cta: "Request Smart Home Setup",
    modal: "BookNow"
  },
  "Cable Management": {
    title: "Hide Your Messy Wires",
    description: "Get clean, premium wire concealment behind the wall or in sleek exterior tracks.",
    usp: "Minimalist setup with zero visible cables.",
    cta: "Request Cable Concealment",
    modal: "BookNow"
  },
  "default": {
    title: "Book a Certified Specialist",
    description: "Get professional TV mounting, soundbar installation, wire hiding, or smart home setup.",
    usp: "Trusted service in your local area with 100% guarantee.",
    cta: "Book Installation Now",
    modal: "BookNow"
  }
};

export default function BlogClient({ 
  initialPosts = [], 
  category = null, 
  cities = [], 
  currentPage = 1, 
  totalPages = 1, 
  postsPerPage = 9 
}) {
  const defaultCities = [
    { name: "Chicago", state: "IL", path: "chicago" },
    { name: "Houston", state: "TX", path: "houston" },
    { name: "Dallas", state: "TX", path: "dallas" },
    { name: "Miami", state: "FL", path: "miami" },
    { name: "Austin", state: "TX", path: "austin" },
    { name: "Charlotte", state: "NC", path: "charlotte" }
  ];
  const displayCities = cities && cities.length > 0 ? cities : defaultCities;
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams ? (searchParams.get("q") || "") : "";

  const [activeCategory, setActiveCategory] = useState(category || "All");
  const [reSearchVal, setReSearchVal] = useState("");
  const [searchPosts, setSearchPosts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(6);

  const slugify = (text) => {
    if (!text) return "";
    return text.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  };

  useEffect(() => {
    setActiveCategory(category || "All");
  }, [category]);

  // Reset pagination count when active views change
  useEffect(() => {
    setVisibleCount(6);
  }, [activeCategory, query, sortBy]);

  // Update re-search input when query changes
  useEffect(() => {
    if (query) {
      setReSearchVal(query);
    }
  }, [query]);

  // Fetch search results directly from Strapi
  useEffect(() => {
    if (!query) {
      setSearchPosts([]);
      setSearchError(null);
      return;
    }

    const fetchSearchResults = async () => {
      setSearchLoading(true);
      setSearchError(null);
      try {
        const strapiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL;
        if (!strapiUrl) {
          throw new Error("NEXT_PUBLIC_SRTAPI_URL environment variable is not defined");
        }
        const qLower = query.trim();

        const queryParts = [
          `filters[$or][0][title][$containsi]=${encodeURIComponent(qLower)}`,
          `filters[$or][1][excerpt][$containsi]=${encodeURIComponent(qLower)}`,
          `filters[$or][2][content][$containsi]=${encodeURIComponent(qLower)}`,
          `filters[$or][3][category][$containsi]=${encodeURIComponent(qLower)}`,
          "populate[0]=cover&populate[1]=author",
          "pagination[pageSize]=50"
        ];

        const queryString = queryParts.join("&");
        const response = await fetch(`${strapiUrl}/api/blog-posts?${queryString}`, {
          headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
          const resJson = await response.json();
          
          const flatten = (data) => {
            if (!data) return null;
            if (Array.isArray(data)) return data.map(flatten);
            const { id, attributes, ...rest } = data;
            return { id, ...attributes, ...rest };
          };

          const strapiPosts = flatten(resJson.data) || [];
          const normalized = strapiPosts.map(post => {
            const formattedDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
              : "";
            
            let imgUrl = "/blog-placeholder.jpg";
            if (post.cover?.url) {
              const url = post.cover.url;
              imgUrl = url.startsWith("http") ? url : `${strapiUrl}${url}`;
            }

            return {
              id: post.id || post.slug,
              slug: post.slug,
              title: post.title,
              excerpt: post.excerpt || "",
              category: post.category || "General",
              date: formattedDate || post.date || "",
              readTime: post.readTime ? `${post.readTime} min read` : "5 min read",
              image: imgUrl,
              coverMedia: post.cover || { url: imgUrl },
              author: {
                name: post.author?.name || "TVPro Specialist",
                role: post.author?.role || "Certified Installer",
                avatarMedia: post.author?.avatar || { url: "/author-placeholder.jpg" }
              }
            };
          });

          setSearchPosts(normalized);
        } else {
          throw new Error(`Search API returned status ${response.status}`);
        }
      } catch (err) {
        console.error("Search results fetch failed:", err);
        setSearchError(err.message || "Failed to load results");
        setSearchPosts([]);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Merge Strapi and Mock posts
  const posts = [];
  for (const p of initialPosts) {
    posts.push({
      ...p,
      coverMedia: p.coverMedia || (p.image ? { url: p.image } : { url: "/blog-placeholder.jpg" }),
      author: {
        ...p.author,
        avatarMedia: p.author?.avatarMedia || (p.author?.avatar ? { url: p.author.avatar } : { url: "/author-placeholder.jpg" })
      }
    });
  }
  for (const mock of blogPosts) {
    if (!posts.find(p => p.slug === mock.slug)) {
      posts.push({
        ...mock,
        coverMedia: mock.image ? { url: mock.image } : { url: "/blog-placeholder.jpg" },
        author: {
          name: mock.author?.name || "TVPro Specialist",
          role: mock.author?.role || "Certified Installer",
          avatarMedia: mock.author?.avatar ? { url: mock.author.avatar } : { url: "/author-placeholder.jpg" }
        }
      });
    }
  }

  // Generate categories dynamically
  const categoriesList = ["All", ...new Set(posts.map(post => post.category).filter(Boolean))];

  // Filtering logic
  let filteredPosts = [];
  if (query) {
    filteredPosts = searchPosts;
  } else {
    filteredPosts = activeCategory === "All"
      ? posts
      : posts.filter(post => post.category === activeCategory);
  }

  // Featured post logic (only when not searching, on "All" category, and on first page)
  const featuredPost = posts.find(post => post.featured);
  const showFeatured = !query && activeCategory === "All" && featuredPost && currentPage === 1;

  const gridPosts = showFeatured
    ? filteredPosts.filter(post => post.id !== featuredPost.id)
    : filteredPosts;

  // Sort posts
  const sortedPosts = [...gridPosts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.date || 0) - new Date(a.date || 0);
    } else if (sortBy === "oldest") {
      return new Date(a.date || 0) - new Date(b.date || 0);
    } else if (sortBy === "alphabetical") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return 0;
  });

  // Slice posts for current page
  let displayedPosts = [];
  if (query) {
    displayedPosts = sortedPosts;
  } else {
    const startIndex = (currentPage - 1) * postsPerPage;
    displayedPosts = sortedPosts.slice(startIndex, startIndex + postsPerPage);
  }
  const hasMore = false; // Disabled in favor of server pagination

  const trendingPosts = posts.slice(0, 5);
  const activePromo = promoOffers[activeCategory] || promoOffers["default"];

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog/" }
  ];

  if (category) {
    breadcrumbItems.push({ name: category, url: `/blog/category/${slugify(category)}/` });
  } else if (query) {
    breadcrumbItems.push({ name: `Search: ${query}`, url: `/blog/?q=${encodeURIComponent(query)}` });
  }

  const handleReSearchSubmit = (e) => {
    e.preventDefault();
    if (reSearchVal.trim()) {
      router.push(`/blog/?q=${encodeURIComponent(reSearchVal.trim())}`);
    }
  };

  // Fallback recommended articles (top 3 posts)
  const recommendedPosts = posts.slice(0, 3);

  return (
    <div className={styles.blogPage}>
      {/* Inject noindex dynamically when in search mode to prevent Google index bloating */}
      {query && <meta name="robots" content="noindex, follow" />}

      {/* Breadcrumbs */}
      <SEOBreadcrumbs items={breadcrumbItems} />

      {/* Header */}
      {query ? (
        <header className={`block ${styles.blogHeader}`}>
          <h1 className={`blockHeading ${styles.title}`}>Search Results for "{query}"</h1>
          <p className={`subText ${styles.subtitle}`}>
            Found {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} matching your query.
          </p>
        </header>
      ) : category ? (
        <header className={`block ${styles.blogHeader}`}>
          <h1 className={`blockHeading ${styles.title}`}>{category}</h1>
          <p className={`subText ${styles.subtitle}`}>
            Expert tips, guides, and smart home updates relating to {category.toLowerCase()}.
          </p>
        </header>
      ) : (
        <header className={`block ${styles.blogHeader}`}>
          <h1 className={`blockHeading ${styles.title}`}>TVPro Handy Insights & Guides</h1>
          <p className={`subText ${styles.subtitle}`}>
            Expert tips, installation guides, and smart home advice from our certified technicians.
          </p>
        </header>
      )}

      {/* Featured Post */}
      {showFeatured && (
        <section className={`block ${styles.featuredSection}`}>
          <Link href={`/blog/${featuredPost.slug}/`} className={styles.featuredCard}>
            <div className={styles.featuredImageWrapper}>
              <ImageWrapper
                media={featuredPost.coverMedia}
                defaultAlt={featuredPost.title}
                className={styles.featuredImage}
                width={800}
                height={500}
                priority={true}
              />
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.meta}>
                <span className={styles.categoryBadge}>{featuredPost.category}</span>
                <span>&bull;</span>
                <span>{featuredPost.date}</span>
                <span>&bull;</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
              <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
              
              <div className={styles.authorContainer}>
                <ImageWrapper
                  media={featuredPost.author.avatarMedia}
                  defaultAlt={featuredPost.author.name}
                  className={styles.authorAvatar}
                  width={40}
                  height={40}
                />
                <div>
                  <div className={styles.authorName}>{featuredPost.author.name}</div>
                  <div className={styles.authorRole}>{featuredPost.author.role}</div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid of Posts */}
      <section className={`block ${styles.gridSection}`}>
        <div className={styles.mainLayout}>
          <div className={styles.contentColumn}>
            {/* Toolbar: Post Count and Sort selector */}
            {!searchLoading && !searchError && gridPosts.length > 0 && (
              <div className={styles.toolbar}>
                <div className={styles.postCount}>
                  Showing <strong>{Math.min(visibleCount, sortedPosts.length)}</strong> of <strong>{sortedPosts.length}</strong> articles
                </div>
                <div className={styles.sortContainer}>
                  <label htmlFor="sort-by" className={styles.sortLabel}>Sort by:</label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.sortSelect}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="alphabetical">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>
            )}

            {searchLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <span>Searching articles...</span>
              </div>
            ) : searchError ? (
              <div className={styles.errorContainer}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "8px" }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <h3 className={styles.errorTitle}>Unable to Connect to Search</h3>
                <p className={styles.errorText}>
                  We couldn't connect to the database to perform the search. If you're running locally, make sure your Strapi server is active or check your NEXT_PUBLIC_SRTAPI_URL setting.
                </p>
              </div>
            ) : filteredPosts.length > 0 ? (
              gridPosts.length > 0 ? (
                <>
                  <div className={styles.grid}>
                    {displayedPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}/`}
                        className={styles.card}
                        aria-label={`Read article: ${post.title}`}
                      >
                        <div className={styles.cardImageWrapper}>
                          <ImageWrapper
                            media={post.coverMedia}
                            defaultAlt={post.title}
                            className={styles.cardImage}
                            width={400}
                            height={250}
                          />
                        </div>
                        <div className={styles.cardContent}>
                          <div className={styles.meta}>
                            <span className={styles.categoryBadge}>{post.category}</span>
                            <span>&bull;</span>
                            <span>{post.readTime}</span>
                          </div>
                          <h3 className={styles.cardTitle}>{post.title}</h3>
                          <p className={styles.cardExcerpt}>{post.excerpt}</p>
                          
                          <div className={styles.meta} style={{ marginTop: "auto", marginBottom: 0, paddingTop: "12px" }}>
                            <span>By {post.author.name}</span>
                            <span>&bull;</span>
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {totalPages > 1 && !query && (
                    <div className={styles.paginationContainer}>
                      {/* Previous page link */}
                      <Link
                        href={
                          currentPage === 2
                            ? (category ? `/blog/category/${slugify(category)}/` : `/blog/`)
                            : (category
                                ? `/blog/category/${slugify(category)}/page/${currentPage - 1}/`
                                : `/blog/page/${currentPage - 1}/`)
                        }
                        className={`${styles.paginationLink} ${currentPage === 1 ? styles.paginationDisabled : ""}`}
                        aria-label="Previous page"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                      </Link>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => {
                        const pageNum = i + 1;
                        const pageUrl = pageNum === 1
                          ? (category ? `/blog/category/${slugify(category)}/` : `/blog/`)
                          : (category
                              ? `/blog/category/${slugify(category)}/page/${pageNum}/`
                              : `/blog/page/${pageNum}/`);
                        return (
                          <Link
                            key={pageNum}
                            href={pageUrl}
                            className={`${styles.paginationLink} ${currentPage === pageNum ? styles.paginationActive : ""}`}
                          >
                            {pageNum}
                          </Link>
                        );
                      })}

                      {/* Next page link */}
                      <Link
                        href={
                          category
                            ? `/blog/category/${slugify(category)}/page/${currentPage + 1}/`
                            : `/blog/page/${currentPage + 1}/`
                        }
                        className={`${styles.paginationLink} ${currentPage === totalPages ? styles.paginationDisabled : ""}`}
                        aria-label="Next page"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </Link>
                    </div>
                  )}
                </>
              ) : null
            ) : (
              <div className={styles.noResultsContainer}>
                <p className={styles.noResultsText}>
                  {category 
                    ? `We don't have any articles in the "${category}" category yet. Check back soon for updates!`
                    : query
                      ? `Sorry, we couldn't find any articles matching "${query}".`
                      : "We don't have any articles published yet. Check back soon for updates!"
                  }
                </p>
                {!category && (
                  <form onSubmit={handleReSearchSubmit} className={styles.reSearchForm}>
                    <input 
                      type="text" 
                      placeholder="Try search another term..." 
                      value={reSearchVal}
                      onChange={(e) => setReSearchVal(e.target.value)}
                      className={styles.reSearchInput}
                    />
                    <Button type="submit" variant="primary">Search</Button>
                  </form>
                )}
                
                {/* Recommended Articles Section */}
                <div className={styles.recommendedWrapper}>
                  <h3 className={styles.recommendedTitle}>Recommended Articles</h3>
                  <div className={styles.recommendedGrid}>
                    {recommendedPosts.map((post) => (
                      <Link 
                        key={post.slug} 
                        href={`/blog/${post.slug}/`}
                        className={styles.recommendedCard}
                      >
                        <ImageWrapper 
                          media={post.coverMedia} 
                          defaultAlt={post.title} 
                          className={styles.recommendedImage} 
                          width={400}
                          height={250}
                        />
                        <div className={styles.recommendedCardContent}>
                          <span className={styles.categoryBadge}>{post.category}</span>
                          <h4 className={styles.recommendedCardTitle}>{post.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Trending Articles Widget */}
            {trendingPosts.length > 0 && (
              <div className={styles.trendingWidget}>
                <h3 className={styles.widgetTitle}>Trending Articles</h3>
                <div className={styles.trendingContainer}>
                  {/* Top 1 */}
                  <Link href={`/blog/${trendingPosts[0].slug}/`} className={styles.trendingHeroCard}>
                    <div className={styles.trendingHeroImageWrapper}>
                      <ImageWrapper 
                        media={trendingPosts[0].coverMedia} 
                        defaultAlt={trendingPosts[0].title} 
                        className={styles.trendingHeroImage} 
                        width={400}
                        height={250}
                      />
                    </div>
                    <div className={styles.trendingHeroContent}>
                      <span className={styles.trendingCategory}>{trendingPosts[0].category}</span>
                      <h4 className={styles.trendingHeroTitle}>{trendingPosts[0].title}</h4>
                    </div>
                  </Link>
                  
                  {/* Top 2-5 */}
                  <div className={styles.trendingList}>
                    {trendingPosts.slice(1).map((tPost) => (
                      <Link key={tPost.slug} href={`/blog/${tPost.slug}/`} className={styles.trendingListItem}>
                        <ImageWrapper 
                          media={tPost.coverMedia} 
                          defaultAlt={tPost.title} 
                          className={styles.trendingListImage} 
                          width={64}
                          height={48}
                        />
                        <div className={styles.trendingListContent}>
                          <span className={styles.trendingCategory}>{tPost.category}</span>
                          <h5 className={styles.trendingListTitle}>{tPost.title}</h5>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Locations Widget */}
            {displayCities && displayCities.length > 0 && (
              <div className={styles.locationsWidget}>
                <h3 className={styles.widgetTitle}>Our Service Locations</h3>
                <div className={styles.locationsList}>
                  {displayCities.map((city) => (
                    <Link
                      key={city.path}
                      href={`/${city.path}/`}
                      className={styles.locationLink}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.locationPinIcon}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{city.name}, {city.state || "US"}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Promo Widget */}
            <div className={styles.promoWidget}>
              <div className={styles.promoBadge}>Service</div>
              <h3 className={styles.promoTitle}>{activePromo.title}</h3>
              <p className={styles.promoDescription}>{activePromo.description}</p>
              <div className={styles.promoUsp}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.promoCheckIcon}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{activePromo.usp}</span>
              </div>
              <QuoteButton size="small" modalName={activePromo.modal} className={styles.promoCtaBtn}>
                {activePromo.cta}
              </QuoteButton>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA Bottom Section */}
      <div className={`block ${styles.ctaWrapper}`} style={{ paddingTop: 0 }}>
        <p className={styles.ctaText}>
          Ready to upgrade your home theater? Book your service with our certified specialists.
        </p>
        <QuoteButton size="big" modalName="BookNow">
          Get The Best Quote
        </QuoteButton>
      </div>
    </div>
  );
}
