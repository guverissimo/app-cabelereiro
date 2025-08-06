import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const updateClientSchema = z.object({
    id: z.string(),
    client_name: z.string().optional(),
    client_phone: z.string().optional(),
})

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const clientId = params.id
        const body = await req.json()

        const validatedData = updateClientSchema.parse(body)

        const existingClient = await prisma.client.findUnique({
            where: { id: clientId },
        })

        if (!existingClient) {
            return NextResponse.json(
                { error: 'Cliente não encontrado' },
                { status: 404 }
            )
        }

        const updatedClient = await prisma.client.update({
            where: { id: clientId },
            data: validatedData,
        })

        return NextResponse.json(updatedClient, { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Erro de validação', issues: error.format() },
                { status: 400 }
            )
        }

        console.error('[PATCH_CLIENT_ERROR]', error)

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    _: NextRequest,
    { params }: { params: { id: string } }
) {
    const clientId = params.id

    try {
        const existingClient = await prisma.client.findUnique({
            where: { id: clientId },
        })

        if (!existingClient) {
            return NextResponse.json(
                { error: 'Cliente não encontrado.' },
                { status: 404 }
            )
        }

        await prisma.client.delete({
            where: { id: clientId },
        })

        return NextResponse.json(
            { message: 'Cliente deletado com sucesso.' },
            { status: 200 }
        )
    } catch (error) {
        console.error('[DELETE_CLIENT_ERROR]', error)

        return NextResponse.json(
            { error: 'Erro interno do servidor.' },
            { status: 500 }
        )
    }
}