import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const collaboratorUpdateSchema = z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    email: z.string().email().optional()
});

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const collaboratorId = params.id;
        const body = await req.json();

        const validatedData = collaboratorUpdateSchema.parse(body);

        const existingCollaborator = await prisma.collaborator.findUnique({
            where: { id: collaboratorId }
        });

        if (!existingCollaborator) {
            return NextResponse.json(
                { error: 'Colaborador não encontrado' },
                { status: 404 }
            );
        }

        const updatedCollaborator = await prisma.collaborator.update({
            where: { id: collaboratorId },
            data: validatedData
        });

        return NextResponse.json(updatedCollaborator, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Erro de validação', issues: error.format() },
                { status: 400 }
            );
        }

        console.error('[PUT_COLLABORATOR_ERROR]', error);

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
        const collaboratorId = params.id;

        const existingCollaborator = await prisma.collaborator.findUnique({
            where: { id: collaboratorId }
        });

        if (!existingCollaborator) {
            return NextResponse.json(
                { error: 'Colaborador não encontrado' },
                { status: 404 }
            );
        }

        await prisma.collaborator.delete({
            where: { id: collaboratorId }
        });

        return NextResponse.json({ message: 'Colaborador deletado com sucesso' }, { status: 200 });
    } catch (error) {
        console.error('[DELETE_COLLABORATOR_ERROR]', error);

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}