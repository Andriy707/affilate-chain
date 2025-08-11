// src/app/api/leads/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

// Helper function to get client IP
function getClientIP(request) {
    const headersList = headers();
    const forwarded = headersList.get('x-forwarded-for');
    const realIP = headersList.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    // Fallback for development
    return '127.0.0.1';
}

export async function POST(request) {
    try {
        const clientIP = getClientIP(request);

        // Check if lead already exists for this IP
        let lead = await prisma.lead.findFirst({
            where: {
                ipAddress: clientIP,
            },
        });

        // If no lead exists, create a new one
        if (!lead) {
            lead = await prisma.lead.create({
                data: {
                    ipAddress: clientIP,
                },
            });

            console.log(`New lead created: ${lead.leadId} for IP: ${clientIP}`);
        }

        return NextResponse.json({
            success: true,
            data: {
                leadId: lead.leadId,
                isNewLead: !lead,
            },
        });
    } catch (error) {
        console.error('Error handling lead:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process lead'
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const clientIP = getClientIP(request);

        const lead = await prisma.lead.findFirst({
            where: {
                ipAddress: clientIP,
            },
        });

        if (!lead) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Lead not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                leadId: lead.leadId,
            },
        });
    } catch (error) {
        console.error('Error fetching lead:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch lead'
            },
            { status: 500 }
        );
    }
}