import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const serviceUpdateSchema = z.object({
    name: z.string().optional(),
    duration_minutes: z.number().optional(),
    price: z.number().optional(),
    description: z.string().optional()
})

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const validatedData = serviceUpdateSchema.parse(body);

        const service = await prisma.service.update({
            where: { id: params.id },
            data: validatedData,
        });

        return NextResponse.json(service);
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

        console.error('[PUT_SERVICE_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.service.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Serviço deletado com sucesso' });
    } catch (error) {
        console.error('[DELETE_SERVICE_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 