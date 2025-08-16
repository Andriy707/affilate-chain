// src/app/api/leads/route.js - FIXED VERSION
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

// Helper function to get client IP with better dev support
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

    // Better fallback for development - create unique IPs per browser session
    // Check if we have a session identifier in the request
    const userAgent = headersList.get('user-agent') || '';
    const acceptLanguage = headersList.get('accept-language') || '';

    // Create a fingerprint for development
    const browserFingerprint = Buffer.from(userAgent + acceptLanguage + Date.now().toString().slice(-6))
        .toString('base64')
        .slice(0, 10);

    // In development, create unique "fake" IPs
    return process.env.NODE_ENV === 'development'
        ? `127.0.0.${Math.abs(hashCode(browserFingerprint)) % 255 + 1}`
        : '127.0.0.1';
}

// Simple hash function for consistent fingerprinting
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}

export async function POST(request) {
    try {
        const clientIP = getClientIP(request);

        console.log(`🔍 Looking for lead with IP: ${clientIP}`);

        // Check if lead already exists for this IP
        let lead = await prisma.lead.findFirst({
            where: {
                ipAddress: clientIP,
            },
        });

        let isNewLead = false;

        // If no lead exists, create a new one
        if (!lead) {
            lead = await prisma.lead.create({
                data: {
                    ipAddress: clientIP,
                },
            });

            isNewLead = true;
            console.log(`✅ New lead created: ${lead.leadId} for IP: ${clientIP}`);
        } else {
            console.log(`🔄 Existing lead found: ${lead.leadId} for IP: ${clientIP}`);
        }

        return NextResponse.json({
            success: true,
            data: {
                leadId: lead.leadId,
                isNewLead,
                clientIP: process.env.NODE_ENV === 'development' ? clientIP : undefined, // Show IP in dev only
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
                clientIP: process.env.NODE_ENV === 'development' ? clientIP : undefined, // Show IP in dev only
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