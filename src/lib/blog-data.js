export const categories = [
  "All",
  "TV Mounting",
  "Home Theater",
  "Wire Management",
  "Tips & Guides"
];

export const blogPosts = [
  {
    id: "post-1",
    slug: "perfect-tv-mounting-height",
    title: "How to Choose the Perfect TV Mounting Height for Your Living Room",
    excerpt: "Avoid neck strain and glare by finding the ideal viewing angle. Learn the standard measurements and how to customize them for your space.",
    category: "TV Mounting",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&h=500&q=80",
    date: "June 10, 2026",
    readTime: "5 min read",
    author: {
      name: "Michael S.",
      role: "Senior TV Mounting Expert",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150&q=80"
    },
    featured: true
  },
  {
    id: "post-2",
    slug: "hiding-tv-wires-pro-ways",
    title: "Hiding TV Wires: 3 Professional Ways to Clean Up Your Setup",
    excerpt: "Dangling cables can ruin the aesthetic of a premium TV setup. Discover the best wire concealment techniques, from in-wall kits to external tracks.",
    category: "Wire Management",
    image: "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=800&h=500&q=80",
    date: "June 8, 2026",
    readTime: "4 min read",
    author: {
      name: "John D.",
      role: "Lead AV Specialist",
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&h=150&q=80"
    }
  },
  {
    id: "post-3",
    slug: "soundbar-vs-surround-sound",
    title: "Home Theater Sound Guide: Soundbar vs. Surround Sound System",
    excerpt: "Should you opt for a sleek smart soundbar or a full 5.1/7.1 speaker channel setup? We break down performance, installation complexity, and costs.",
    category: "Home Theater",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&h=500&q=80",
    date: "June 5, 2026",
    readTime: "6 min read",
    author: {
      name: "Brian T.",
      role: "Soundbar & Connectivity Pro",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80"
    }
  },
  {
    id: "post-4",
    slug: "drywall-vs-brick-mounting",
    title: "Mounting a TV on Drywall vs. Brick: What You Need to Know",
    excerpt: "Different wall types require specific brackets, anchors, and drilling speeds. Learn how to secure your TV safely without damaging your property.",
    category: "TV Mounting",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=500&q=80",
    date: "May 28, 2026",
    readTime: "5 min read",
    author: {
      name: "Kevin W.",
      role: "Premium Mounting Tech",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
    }
  },
  {
    id: "post-5",
    slug: "pre-booking-checklist",
    title: "The Ultimate Checklist Before Booking a Professional TV Mount Service",
    excerpt: "Make sure you have everything ready for your technician. From checking VESA sizes to choosing the right cable lengths and bracket styles.",
    category: "Tips & Guides",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&h=500&q=80",
    date: "May 15, 2026",
    readTime: "3 min read",
    author: {
      name: "Robert M.",
      role: "Master Installer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
    }
  }
];

// Mock rich-text content — used as fallback when Strapi is unavailable.
// Format mirrors Strapi Blocks JSON structure so RichTextRenderer works identically.
export const mockBlogContent = {
  "perfect-tv-mounting-height": [
    {
      type: "paragraph",
      children: [{ type: "text", text: "Choosing the right TV mounting height is one of the most overlooked decisions in home theater setup. Get it wrong, and you'll be straining your neck every movie night. Get it right, and your viewing experience will feel completely natural." }]
    },
    {
      type: "heading", level: 2,
      children: [{ type: "text", text: "The Golden Rule: Eye Level When Seated" }]
    },
    {
      type: "paragraph",
      children: [{ type: "text", text: "The center of your TV screen should align with your eye level when you're seated in your primary viewing position. For most people sitting on a standard couch, that's approximately 42–48 inches from the floor." }]
    },
    {
      type: "quote",
      children: [{ type: "text", text: "\"Neck strain from poorly mounted TVs is one of the top complaints we hear from new clients. A 4-inch adjustment can make a world of difference.\" — Michael S., Senior TV Mounting Expert" }]
    },
    {
      type: "heading", level: 2,
      children: [{ type: "text", text: "How to Measure the Right Height" }]
    },
    {
      type: "list", format: "ordered",
      children: [
        { type: "list-item", children: [{ type: "text", text: "Sit in your most common viewing spot on the couch." }] },
        { type: "list-item", children: [{ type: "text", text: "Have someone measure from the floor to the center of your eyes — this is your ideal screen center height." }] },
        { type: "list-item", children: [{ type: "text", text: "Mark that height on the wall, then position the TV mount so the center of the TV hits that mark." }] },
        { type: "list-item", children: [{ type: "text", text: "Use a level to make sure the mount is perfectly horizontal before drilling." }] }
      ]
    },
    {
      type: "heading", level: 2,
      children: [{ type: "text", text: "Special Situations" }]
    },
    {
      type: "heading", level: 3,
      children: [{ type: "text", text: "Bedroom TVs" }]
    },
    {
      type: "paragraph",
      children: [{ type: "text", text: "In bedrooms where you watch while lying down or propped up on pillows, the ideal height is typically 6–12 inches higher than the standard seated rule. A tilting mount is recommended so you can angle the screen down toward you." }]
    },
    {
      type: "heading", level: 3,
      children: [{ type: "text", text: "Above-Fireplace Mounting" }]
    },
    {
      type: "paragraph",
      children: [
        { type: "text", text: "Mounting above a fireplace is " },
        { type: "text", text: "not recommended", bold: true },
        { type: "text", text: " as the standard position — it places the screen 15–20 inches too high and causes significant neck strain. If you must go above a fireplace, use a full-motion articulating arm mount that allows you to tilt the screen down at least 15°." }
      ]
    },
    {
      type: "heading", level: 2,
      children: [{ type: "text", text: "When to Call a Professional" }]
    },
    {
      type: "paragraph",
      children: [{ type: "text", text: "If you're mounting a TV larger than 55 inches, dealing with a non-standard wall type (brick, tile, plaster), or need to route cables through the wall — professional installation pays for itself in peace of mind and safety." }]
    },
    {
      type: "list", format: "unordered",
      children: [
        { type: "list-item", children: [{ type: "text", text: "TVs 55\"+: need stud-finding and heavy-duty anchors" }] },
        { type: "list-item", children: [{ type: "text", text: "Brick or concrete walls: require hammer drills and masonry anchors" }] },
        { type: "list-item", children: [{ type: "text", text: "In-wall cable management: electrical permit may be required" }] }
      ]
    }
  ],

  "hiding-tv-wires-pro-ways": [
    {
      type: "paragraph",
      children: [{ type: "text", text: "One of the most common complaints after a TV is mounted on the wall is the tangle of cables hanging visibly below it. Here are three professional solutions ranked from simplest to most polished." }]
    },
    {
      type: "heading", level: 2,
      children: [{ type: "text", text: "Option 1: External Cable Raceway" }]
    },
    {
      type: "paragraph",
      children: [{ type: "text", text: "Cable raceways are plastic channels that mount on the wall surface to organize and conceal cables. They come in white, black, and paintable varieties. Installation takes under 30 minutes and requires no wall cutting." }]
    },
    {
      type: "heading", level: 2,
      children: [{ type: "text", text: "Option 2: In-Wall Cable Kit" }]
    },
    {
      type: "paragraph",
      children: [{ type: "text", text: "An in-wall cable management kit routes your cables through the drywall using two wall plates — one behind the TV and one at the outlet level. This creates a completely clean look from the front." }]
    },
    {
      type: "quote",
      children: [{ type: "text", text: "\"In-wall kits are the most requested upgrade we do. Clients see before/after photos and immediately want it done.\" — John D., Lead AV Specialist" }]
    },
    {
      type: "heading", level: 2,
      children: [{ type: "text", text: "Option 3: Full In-Wall Conduit" }]
    },
    {
      type: "paragraph",
      children: [{ type: "text", text: "The most professional solution: install an EMT conduit or PVC conduit inside the wall cavity, with a recessed power outlet and low-voltage bracket behind the TV. Future-proof for any cable changes." }]
    }
  ]
};
