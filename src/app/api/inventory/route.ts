import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inventorySchema = z.object({
    product_name: z.string(),
    quantity: z.number(),
    unit_price: z.number(),
    last_updated: z.string()
})

export async function GET() {
    try {
        const inventory = await prisma.inventory.findMany({
            orderBy: { product_name: 'asc' }
        });
        return NextResponse.json(inventory);
    } catch (error) {
        console.error('[GET_INVENTORY_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = inventorySchema.parse(body);

        const inventory = await prisma.inventory.create({
            data: validatedData,
        });

        return NextResponse.json(inventory, { status: 201 });
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

        console.error('[POST_INVENTORY_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 