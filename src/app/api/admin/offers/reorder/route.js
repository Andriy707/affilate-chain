// src/app/api/admin/offers/reorder/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth';

// PUT - Reorder offers
export async function PUT(request) {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    try {
        const body = await request.json();
        const { offerIds } = body;

        // Validate input
        if (!Array.isArray(offerIds) || offerIds.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'offerIds must be a non-empty array'
                },
                { status: 400 }
            );
        }

        // Update positions in a transaction
        const updatedOffers = await prisma.$transaction(
            offerIds.map((offerId, index) =>
                prisma.offer.update({
                    where: { offerId },
                    data: { position: index + 1 },
                })
            )
        );

        return NextResponse.json({
            success: true,
            data: updatedOffers,
            message: 'Offers reordered successfully',
        });
    } catch (error) {
        console.error('Error reordering offers:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to reorder offers'
            },
            { status: 500 }
        );
    }
}