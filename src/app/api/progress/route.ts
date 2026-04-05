import { NextResponse } from 'next/server';

export async function GET() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
        communication: 72,
        personality: 65,
        career: 58,
        confidence: 70
    });
}
