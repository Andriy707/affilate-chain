// src/app/api/offers/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const offers = await prisma.offer.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                position: 'asc',
            },
            select: {
                offerId: true,
                title: true,
                description: true,
                savingsText: true,
                affiliateUrl: true,
                position: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: offers,
            count: offers.length,
        });
    } catch (error) {
        console.error('Error fetching offers:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch offers'
            },
            { status: 500 }
        );
    }
}