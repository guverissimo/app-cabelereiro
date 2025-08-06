import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const cashflowUpdateSchema = z.object({
    type: z.enum(['ENTRADA', 'SAIDA']).optional(),
    description: z.string().optional(),
    amount: z.number().optional(),
    date: z.string().optional(),
    category: z.string().optional(),
    appointment_id: z.string().optional()
})

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const validatedData = cashflowUpdateSchema.parse(body);

        const cashflow = await prisma.cashflow.update({
            where: { id: params.id },
            data: validatedData,
        });

        return NextResponse.json(cashflow);
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

        console.error('[PUT_CASHFLOW_ERROR]', error);
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
        await prisma.cashflow.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Transação deletada com sucesso' });
    } catch (error) {
        console.error('[DELETE_CASHFLOW_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 