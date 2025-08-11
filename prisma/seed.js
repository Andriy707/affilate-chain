// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const seedOffers = [
    {
        title: "Find Low Final Expense Insurance Rates In As Little As 15 Minutes",
        description: "Average premiums start around $1/day. Don't leave your family with unexpected expenses.",
        savingsText: "YOU MAY BE ABLE TO SAVE UP TO $450/YEAR",
        affiliateUrl: "https://example.com/insurance-offer",
        position: 1,
    },
    {
        title: "Get Cash Back on Every Purchase with This Amazing Credit Card",
        description: "Earn 2% cash back on all purchases with no annual fee. Start saving money today.",
        savingsText: "YOU COULD EARN UP TO $500/YEAR IN CASH BACK",
        affiliateUrl: "https://example.com/credit-card-offer",
        position: 2,
    },
    {
        title: "Lower Your Internet Bill by 40% with This Provider",
        description: "High-speed internet starting at just $29.99/month. No contracts, no hidden fees.",
        savingsText: "SAVE UP TO $300/YEAR ON INTERNET COSTS",
        affiliateUrl: "https://example.com/internet-offer",
        position: 3,
    },
    {
        title: "Refinance Your Mortgage and Save Thousands",
        description: "Rates as low as 2.9% APR. See if you qualify for a lower payment in minutes.",
        savingsText: "POTENTIAL SAVINGS UP TO $2,500/YEAR",
        affiliateUrl: "https://example.com/mortgage-offer",
        position: 4,
    },
    {
        title: "Free Home Security System Installation",
        description: "Professional monitoring starting at $19.99/month. Protect your family today.",
        savingsText: "FREE INSTALLATION SAVES YOU $199",
        affiliateUrl: "https://example.com/security-offer",
        position: 5,
    },
    {
        title: "Cut Your Car Insurance by Up to 50%",
        description: "Compare rates from top providers and find the best deal in your area.",
        savingsText: "AVERAGE SAVINGS OF $847/YEAR",
        affiliateUrl: "https://example.com/auto-insurance-offer",
        position: 6,
    },
    {
        title: "Solar Panels: $0 Down Installation Available",
        description: "Generate your own clean energy and reduce electric bills by up to 90%.",
        savingsText: "SAVE UP TO $1,200/YEAR ON ELECTRICITY",
        affiliateUrl: "https://example.com/solar-offer",
        position: 7,
    },
    {
        title: "Get Pre-Approved for a Personal Loan Today",
        description: "Borrow up to $40,000 with fixed rates. Check your rate without affecting credit score.",
        savingsText: "RATES AS LOW AS 5.99% APR",
        affiliateUrl: "https://example.com/loan-offer",
        position: 8,
    },
    {
        title: "Meal Kit Delivery: 50% Off First 3 Boxes",
        description: "Fresh ingredients and easy recipes delivered to your door weekly.",
        savingsText: "SAVE OVER $150 ON YOUR FIRST MONTH",
        affiliateUrl: "https://example.com/meal-kit-offer",
        position: 9,
    },
    {
        title: "Professional Resume Writing Service",
        description: "Boost your career with a professionally written resume. 90% of clients get interviews.",
        savingsText: "SPECIAL DISCOUNT: 40% OFF TODAY ONLY",
        affiliateUrl: "https://example.com/resume-offer",
        position: 10,
    },
];

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.action.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.offer.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Seed offers
    for (const offer of seedOffers) {
        await prisma.offer.create({
            data: offer,
        });
    }

    console.log(`✅ Created ${seedOffers.length} offers`);
    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });