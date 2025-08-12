import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const serviceSchema = z.object({
    name: z.string(),
    duration_minutes: z.number(),
    price: z.number(),
    description: z.string().optional()
})

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(services);
    } catch (error) {
        console.error('[GET_SERVICES_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = serviceSchema.parse(body);

        const service = await prisma.service.create({
            data: {
                ...validatedData,
                description: validatedData.description ?? "", 
            },
        });

        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Erro de validação',
                    issues: error.format(),
                },
                { status: 400 }
            );
        }

        console.error('[POST_SERVICE_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 