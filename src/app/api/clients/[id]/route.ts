import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const updateClientSchema = z.object({
    id: z.string(),
    client_name: z.string().optional(),
    client_phone: z.string().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const clientId = params.id;
        const body = await req.json();

        const valid = updateClientSchema.parse(body);

        const update = await prisma.client.update({
            where: { id: clientId },
            data: valid
        })
        return NextResponse.json(update)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Erro de validação", issues: error.errors }, { status: 400 });
        }

        console.error("Erro ao atualizar cliente:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const existing = await prisma.client.findUnique({ where: { id: params.id } })
        if (!existing) {
            return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
        }
        await prisma.client.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "Cliente deletado com sucesso" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}