import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const cashflowSchema = z.object({
    type: z.enum(['ENTRADA', 'SAIDA']),
    description: z.string(),
    amount: z.number(),
    date: z.string(),
    category: z.string(),
    appointment_id: z.string().optional()
})

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const category = searchParams.get('category');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let where: any = {};

        if (type) {
            where.type = type;
        }
        if (category) {
            where.category = category;
        }
        if (startDate) {
            where.date = {
                gte: startDate
            };
        }
        if (endDate) {
            where.date = {
                ...where.date,
                lte: endDate
            };
        }

        const cashflow = await prisma.cashflow.findMany({
            where,
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(cashflow);
    } catch (error) {
        console.error('[GET_CASHFLOW_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = cashflowSchema.parse(body);

        const cashflow = await prisma.cashflow.create({
            data: validatedData,
        });

        return NextResponse.json(cashflow, { status: 201 });
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

        console.error('[POST_CASHFLOW_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 