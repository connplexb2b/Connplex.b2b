export const formats = [
  {
    code: "GamePlex Mini",
    tagline: "Compact by Design. Complete by Experience.",
    area: "5,000 Sq. Ft.",
    investment: "₹2 Cr.",
    description: "Perfect for growing cities where premium entertainment is still untapped.",
    highlights: ["Bowling · 6 lanes", "Arcade & redemption", "Café & lounge", "Party room"],
    image: "/assets/gameplex/gameplex-mini.jpg",
    imageAlt: "Luxury compact GamePlex Mini venue",
  },
  {
    code: "GamePlex Standard",
    tagline: "The Signature Experience.",
    area: "10,000 Sq. Ft.",
    investment: "₹4 Cr.",
    description: "Designed for cities where entertainment becomes a destination.",
    highlights: ["Bowling · 10 lanes", "VR & racing simulators", "Restaurant & coffee lounge", "Kids zone + party rooms"],
    image: "/assets/gameplex/gameplex-standard.jpg",
    imageAlt: "Mid-size GamePlex Standard venue",
  },
  {
    code: "GamePlex Grand",
    tagline: "Our Flagship Destination.",
    area: "15,000 Sq. Ft.",
    investment: "₹6 Cr.",
    description: "A landmark entertainment venue combining gaming, dining and celebration at scale.",
    highlights: ["Bowling · 16 lanes", "Full immersive VR arena", "Restaurant, café & live stage", "Corporate & event spaces"],
    image: "/assets/gameplex/gameplex-grand.jpg",
    imageAlt: "Flagship GamePlex Grand entertainment complex",
  },
] as const;

export const experiences = [
  { icon: "🎳", name: "Premium Bowling", group: "Play" },
  { icon: "🕹️", name: "Arcade & Redemption Games", group: "Play" },
  { icon: "🏎️", name: "Racing Simulators", group: "Play" },
  { icon: "🏏", name: "Cricket Simulators", group: "Play" },
  { icon: "🥽", name: "Virtual Reality Zone", group: "Play" },
  { icon: "🎯", name: "Interactive Skill Games", group: "Play" },
  { icon: "👨‍👩‍👧", name: "Kids Play Area", group: "Celebrate" },
  { icon: "🎉", name: "Birthday Party Rooms", group: "Celebrate" },
  { icon: "🏢", name: "Corporate Event Spaces", group: "Celebrate" },
  { icon: "🍽️", name: "Restaurant & Café", group: "Dine" },
  { icon: "☕", name: "Coffee Lounge", group: "Dine" },
  { icon: "🎵", name: "Live Entertainment & Events", group: "Celebrate" },
  { icon: "📸", name: "Instagrammable Experiences", group: "Play" },
  { icon: "🎁", name: "Merchandise & Gift Shop", group: "Dine" },
] as const;

export const pillars = [
  { n: "01", title: "Brand", stat: "Market-Leading", copy: "Built to dominate premium entertainment in every city.", image: "/assets/gameplex/pillar-brand.jpg", imageAlt: "GamePlex brand pillar representation" },
  { n: "02", title: "Design", stat: "Revenue-First", copy: "Layouts engineered for guest flow and higher spend.", image: "/assets/gameplex/pillar-design.jpg", imageAlt: "Premium revenue-first venue layouts design" },
  { n: "03", title: "Operations", stat: "Seamless", copy: "Everything handled, from launch to daily management.", image: "/assets/gameplex/pillar-operations.jpg", imageAlt: "Expert operational support systems" },
  { n: "04", title: "Technology", stat: "24/7", copy: "Integrated booking and management.", image: "/assets/gameplex/pillar-technology.jpg", imageAlt: "State-of-the-art interactive gaming tech stack" },
  { n: "05", title: "Marketing", stat: "PAN-India", copy: "National campaigns driving awareness.", image: "/assets/gameplex/pillar-marketing.jpg", imageAlt: "High impact national marketing campaigns" },
  { n: "06", title: "Growth", stat: "3 Formats", copy: "Scalable formats for every market.", image: "/assets/gameplex/pillar-growth.jpg", imageAlt: "Scalable commercial growth formats" },
] as const;
