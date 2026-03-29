export const CATEGORIES = [
  { id: 1, label: "For You", slug: "foryou", icon: "✨" },
  { id: 2, label: "Fashion", slug: "fashion", icon: "👗" },
  { id: 3, label: "Jewelry", slug: "jewelry", icon: "💍" },
  { id: 4, label: "Handmade", slug: "handmade", icon: "🧶" },
  { id: 5, label: "Home Decor", slug: "home-decor", icon: "🏺" },
  { id: 6, label: "Crafts", slug: "crafts", icon: "🎨" },
  { id: 7, label: "Textiles", slug: "textiles", icon: "🧵" },
  { id: 8, label: "Pottery", slug: "pottery", icon: "🪔" },
  { id: 9, label: "Paintings", slug: "paintings", icon: "🖼️" },
  { id: 10, label: "Bags", slug: "bags", icon: "👜" },
  { id: 11, label: "Footwear", slug: "footwear", icon: "👡" },
  { id: 12, label: "Wellness", slug: "wellness", icon: "🌿" },
];

export const getCategoryBySlug = (slug) => CATEGORIES.find(c => c.slug === slug);
export const getCategoryByLabel = (label) => CATEGORIES.find(c => c.label === label);
