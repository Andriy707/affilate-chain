// src/lib/db.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Helper function to handle database errors
export const handleDbError = (error) => {
    console.error('Database error:', error);

    if (error.code === 'P2002') {
        return { error: 'Record already exists' };
    }

    if (error.code === 'P2025') {
        return { error: 'Record not found' };
    }

    return { error: 'Database operation failed' };
};