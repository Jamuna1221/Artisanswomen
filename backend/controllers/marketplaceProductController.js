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
    const { category: raw, search } = req.query;
    const filter = {
      status: "Active",
      isVisible: true,
    };

    if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
      const categoryName = String(raw).trim();
      const catDoc = await Category.findOne({ name: new RegExp(`^${categoryName}$`, "i") });
      if (!catDoc) {
        return res.status(200).json({ products: [], count: 0 });
      }
      filter.category = catDoc._id;
    }

    if (search && String(search).trim() !== "") {
      const searchRegex = new RegExp(String(search).trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
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

/**
 * GET /api/products/category/:categoryName
 * Fetch products from MongoDB where category name matches req.params.categoryName (case-insensitive)
 */
const getProductsByCategoryName = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { sort, rating } = req.query;

    // Try finding all categories that might match (exact name or slug)
    const catDocs = await Category.find({ 
      $or: [
        { name: new RegExp(`^${categoryName}$`, "i") },
        { name: new RegExp(`^${categoryName.replace(/-/g, " ")}$`, "i") }
      ]
    });
    
    // If it's a special "For You" but no category doc exists, handle specially
    if (catDocs.length === 0 && categoryName === "foryou") {
       const allFilter = { status: "Active", isVisible: true };
       const products = await Product.find(allFilter)
          .populate("category", "name")
          .populate("artisanId", "name shopName city state")
          .sort({ rating: -1, createdAt: -1 })
          .limit(20)
          .lean();
        
       const mapped = products.map((p) => {
         const artisan = p.artisanId;
         return {
           _id: p._id,
           name: p.title,
           price: p.price,
           image: p.images?.[0] || null,
           category: p.category?.name || "Uncategorized",
           artisanName: artisan ? (artisan.shopName || artisan.name) : "Artisan",
           rating: p.rating || 0,
           ratingCount: p.ratingCount || 0,
           createdAt: p.createdAt,
         };
       });

       return res.status(200).json({ 
         products: mapped, 
         count: mapped.length, 
         category: "For You",
         categoryFound: true 
       });
    }

    if (catDocs.length === 0) {
      return res.status(200).json({ products: [], count: 0, categoryFound: false });
    }

    const catIds = catDocs.map(c => c._id);
    const filter = {
      category: { $in: catIds },
      status: "Active",
      isVisible: true,
    };

    // Rating filter
    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_low") sortOption = { price: 1 };
    if (sort === "price_high") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("artisanId", "name shopName city state")
      .sort(sortOption)
      .lean({ virtuals: true });

    const mapped = products.map((p) => {
      const artisan = p.artisanId;
      const artisanLabel = artisan 
        ? (artisan.shopName || artisan.name || "Artisan")
        : "Artisan";

      return {
        _id: p._id,
        name: p.title,
        price: p.price,
        image: p.images?.[0] || null,
        category: p.category?.name || "Uncategorized",
        artisanName: artisanLabel,
        rating: p.rating || 0,
        ratingCount: p.ratingCount || 0,
        createdAt: p.createdAt,
      };
    });

    res.status(200).json({ 
      products: mapped, 
      count: mapped.length, 
      category: catDocs[0].name,
      categoryFound: true 
    });
  } catch (err) {
    console.error("getProductsByCategoryName:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/products/:productId
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate("category", "name")
      .populate("artisanId", "name shopName city state about avatar");

    if (!product || product.status !== "Active" || !product.isVisible) {
      return res.status(404).json({ message: "Product not found or unavailable" });
    }

    // Increment view count
    product.viewCount = (product.viewCount || 0) + 1;
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/products/:productId/related
 */
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Main product not found" });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: "Active",
      isVisible: true
    })
    .limit(4)
    .populate("artisanId", "shopName name");

    const mapped = related.map(p => ({
      _id: p._id,
      name: p.title,
      price: p.price,
      mrp: p.mrp,
      image: p.images?.[0] || null,
      artisanName: p.artisanId?.shopName || p.artisanId?.name || "Artisan",
      rating: p.rating || 0
    }));

    res.status(200).json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  listPublicProducts,
  getProductsByCategoryName,
  getProductById,
  getRelatedProducts
};
