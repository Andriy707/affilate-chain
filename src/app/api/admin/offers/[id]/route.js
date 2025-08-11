// src/app/api/admin/offers/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth';

// GET - Get single offer
export async function GET(request, { params }) {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    try {
        const { id } = params;

        const offer = await prisma.offer.findUnique({
            where: { offerId: id },
            include: {
                _count: {
                    select: {
                        actions: true,
                    },
                },
            },
        });

        if (!offer) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Offer not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: offer,
        });
    } catch (error) {
        console.error('Error fetching offer:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch offer'
            },
            { status: 500 }
        );
    }
}

// PUT - Update offer
export async function PUT(request, { params }) {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    try {
        const { id } = params;
        const body = await request.json();
        const { title, description, savingsText, affiliateUrl, position, isActive } = body;

        // Check if offer exists
        const existingOffer = await prisma.offer.findUnique({
            where: { offerId: id },
        });

        if (!existingOffer) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Offer not found'
                },
                { status: 404 }
            );
        }

        // Update offer
        const updatedOffer = await prisma.offer.update({
            where: { offerId: id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(savingsText && { savingsText }),
                ...(affiliateUrl && { affiliateUrl }),
                ...(position !== undefined && { position }),
                ...(isActive !== undefined && { isActive }),
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedOffer,
        });
    } catch (error) {
        console.error('Error updating offer:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update offer'
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete offer
export async function DELETE(request, { params }) {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    try {
        const { id } = params;

        // Check if offer exists
        const existingOffer = await prisma.offer.findUnique({
            where: { offerId: id },
        });

        if (!existingOffer) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Offer not found'
                },
                { status: 404 }
            );
        }

        // Delete offer (actions will be deleted due to cascade)
        await prisma.offer.delete({
            where: { offerId: id },
        });

        return NextResponse.json({
            success: true,
            message: 'Offer deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting offer:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete offer'
            },
            { status: 500 }
        );
    }
}