// src/app/api/admin/offers/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth';

// GET - List all offers (admin view)
export async function GET(request) {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    try {
        const offers = await prisma.offer.findMany({
            orderBy: {
                position: 'asc',
            },
            include: {
                _count: {
                    select: {
                        actions: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: offers,
            count: offers.length,
        });
    } catch (error) {
        console.error('Error fetching offers (admin):', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch offers'
            },
            { status: 500 }
        );
    }
}

// POST - Create new offer
export async function POST(request) {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    try {
        const body = await request.json();
        const { title, description, savingsText, affiliateUrl, position } = body;

        // Validate required fields
        if (!title || !description || !savingsText || !affiliateUrl) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'title, description, savingsText, and affiliateUrl are required'
                },
                { status: 400 }
            );
        }

        // If no position provided, set to last position + 1
        let offerPosition = position;
        if (!offerPosition) {
            const lastOffer = await prisma.offer.findFirst({
                orderBy: { position: 'desc' },
            });
            offerPosition = (lastOffer?.position || 0) + 1;
        }

        const offer = await prisma.offer.create({
            data: {
                title,
                description,
                savingsText,
                affiliateUrl,
                position: offerPosition,
            },
        });

        return NextResponse.json({
            success: true,
            data: offer,
        });
    } catch (error) {
        console.error('Error creating offer:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create offer'
            },
            { status: 500 }
        );
    }
}