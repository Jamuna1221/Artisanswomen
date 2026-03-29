const Product = require("../models/Product");
const Category = require("../models/Category");

/**
 * GET /api/products
 * Optional query: ?category=Fashion  (exact, case-sensitive match on Category.name)
 * Returns products visible on the marketplace: Active + isVisible.
 * Maps DB fields to API shape: name, image, sellerId, etc.
 */
const listPublicProducts = async (req, res) => {
  try {
    const raw = req.query.category;
    const filter = {
      status: "Active",
      isVisible: true,
    };

    if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
      const categoryName = String(raw).trim();
      const catDoc = await Category.findOne({ name: categoryName });
      if (!catDoc) {
        return res.status(200).json({ products: [], count: 0 });
      }
      filter.category = catDoc._id;
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("artisanId", "name shopName city state")
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    const mapped = products.map((p) => {
      const artisan = p.artisanId;
      const artisanLabel = artisan
        ? [artisan.name || artisan.shopName, artisan.city].filter(Boolean).join(" · ") || "Artisan"
        : "Artisan";

      return {
        _id: p._id,
        name: p.title,
        price: p.price,
        image: p.images?.[0] ?? null,
        images: p.images || [],
        category: p.category?.name ?? null,
        sellerId: artisan?._id ?? p.artisanId,
        artisanName: artisanLabel,
        createdAt: p.createdAt,
        rating: typeof p.rating === "number" ? p.rating : 0,
        ratingCount: typeof p.ratingCount === "number" ? p.ratingCount : 0,
      };
    });

    res.status(200).json({ products: mapped, count: mapped.length });
  } catch (err) {
    console.error("listPublicProducts:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = {
  listPublicProducts,
};
