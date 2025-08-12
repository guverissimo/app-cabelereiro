import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inventoryUpdateSchema = z.object({
    product_name: z.string().optional(),
    quantity: z.number().optional(),
    unit_price: z.number().optional(),
    last_updated: z.string().optional()
})

export async function PUT(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        const body = await req.json();
        const validatedData = inventoryUpdateSchema.parse(body);

        const inventory = await prisma.inventory.update({
            where: { id },
            data: validatedData,
        });

        return NextResponse.json(inventory);
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

        console.error('[PUT_INVENTORY_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        await prisma.inventory.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        console.error('[DELETE_INVENTORY_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}