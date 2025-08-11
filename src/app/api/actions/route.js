// src/app/api/actions/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            leadId,
            actionType,
            sessionId,
            offerId,
            offerPosition,
            metadata
        } = body;

        // Validate required fields
        if (!leadId || !actionType) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'leadId and actionType are required'
                },
                { status: 400 }
            );
        }

        // Validate actionType
        const validActionTypes = ['PATH_VIEW', 'PATH_DECLINE', 'PATH_SUBMIT'];
        if (!validActionTypes.includes(actionType)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid actionType. Must be: PATH_VIEW, PATH_DECLINE, or PATH_SUBMIT'
                },
                { status: 400 }
            );
        }

        // Verify lead exists
        const leadExists = await prisma.lead.findUnique({
            where: { leadId },
        });

        if (!leadExists) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Lead not found'
                },
                { status: 404 }
            );
        }

        // Create action record
        const action = await prisma.action.create({
            data: {
                leadId,
                actionType,
                sessionId: sessionId || null,
                offerId: offerId || null,
                offerPosition: offerPosition || null,
                metadata: metadata || null,
            },
        });

        console.log(`Action logged: ${actionType} for lead ${leadId}`);

        return NextResponse.json({
            success: true,
            data: {
                actionId: action.actionId,
                actionType: action.actionType,
                timestamp: action.createdAt,
            },
        });
    } catch (error) {
        console.error('Error logging action:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to log action'
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const leadId = searchParams.get('leadId');
        const actionType = searchParams.get('actionType');

        let whereClause = {};

        if (leadId) {
            whereClause.leadId = leadId;
        }

        if (actionType) {
            whereClause.actionType = actionType;
        }

        const actions = await prisma.action.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
            take: 100, // Limit to last 100 actions
            include: {
                offer: {
                    select: {
                        title: true,
                        position: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: actions,
            count: actions.length,
        });
    } catch (error) {
        console.error('Error fetching actions:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch actions'
            },
            { status: 500 }
        );
    }
}