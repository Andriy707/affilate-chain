// src/lib/auth.js
import { NextResponse } from 'next/server';

export function checkAdminAuth(request) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
        return NextResponse.json(
            {
                success: false,
                error: 'Authorization header required'
            },
            { status: 401 }
        );
    }

    // Extract credentials from Basic Auth
    const base64Credentials = authHeader.split(' ')[1];
    if (!base64Credentials) {
        return NextResponse.json(
            {
                success: false,
                error: 'Invalid authorization format'
            },
            { status: 401 }
        );
    }

    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Check against environment variables
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== validUsername || password !== validPassword) {
        return NextResponse.json(
            {
                success: false,
                error: 'Invalid credentials'
            },
            { status: 401 }
        );
    }

    // Auth successful - return null to continue
    return null;
}

// Helper function to create Basic Auth header
export function createAuthHeader(username, password) {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${credentials}`;
}