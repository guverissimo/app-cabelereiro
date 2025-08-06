import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const collaboratorSchema = z.object({
        name: z.string(),
        role: z.string(),
        email: z.email(),
})

export async function GET() {
    const res = await prisma.collaborator.findMany();

    return NextResponse.json(res);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log(body);
        
        const validatedData = collaboratorSchema.parse(body);

        const existingCollaborator = await prisma.collaborator.findFirst({
            where: { email: validatedData.email },
        })

        if (existingCollaborator) {
            return NextResponse.json(
                { error: 'Já existe um colaborador com este email.' },
                { status: 409 }
            )
        }

        const collaborator = await prisma.collaborator.create({
            data: validatedData,
        });

        return NextResponse.json(collaborator, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Erro de validação',
                    issues: error.format(),
                },
                { status: 400 }
            )
        }

        console.error('[POST_COLLABORATOR_ERROR]', error)

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

