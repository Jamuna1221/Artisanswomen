require("dotenv").config();
const mongoose = require("mongoose");
const FAQ = require("../models/FAQ");

const faqs = [
    {
        question: "How to register as an artisan?",
        answer: "Simply click the 'Register' button on the artisan portal, provide your ID proof, and wait for our team's verification.",
        category: "Registration"
    },
    {
        question: "How long does approval take?",
        answer: "The manual vetting process usually takes 24–48 hours to ensure craftsmanship quality.",
        category: "Verification"
    },
    {
        question: "How to track my order?",
        answer: "You can use the 'Track My Order' link in the footer and enter your Order ID received via email.",
        category: "Orders"
    },
    {
        question: "What is MarketLink for Women Artisans?",
        answer: "It's a platform dedicated to giving rural women artisans direct access to global markets for their handmade crafts.",
        category: "General"
    }
];

const seedFAQs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");
        
        await FAQ.deleteMany();
        await FAQ.insertMany(faqs);
        
        console.log("Successfully seeded Help FAQs ✅");
        process.exit();
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
};

seedFAQs();
