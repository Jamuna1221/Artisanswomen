const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc Monthly registration trend (last 6 months)
const getAnalyticsOverview = async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({ year: date.getFullYear(), month: date.getMonth() + 1 });
    }

    const registrations = await Promise.all(
      months.map(({ year, month }) =>
        User.countDocuments({
          createdAt: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        })
      )
    );

    const orders = await Promise.all(
      months.map(({ year, month }) =>
        Order.countDocuments({
          createdAt: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        })
      )
    );

    const revenue = await Promise.all(
      months.map(async ({ year, month }) => {
        const result = await Order.aggregate([
          {
            $match: {
              paymentStatus: "Paid",
              createdAt: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        return result[0]?.total || 0;
      })
    );

    const labels = months.map(({ year, month }) =>
      new Date(year, month - 1, 1).toLocaleString("default", { month: "short", year: "2-digit" })
    );

    res.json({ labels, registrations, orders, revenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnalyticsOverview };
