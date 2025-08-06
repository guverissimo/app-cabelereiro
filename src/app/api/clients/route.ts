import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const clientSchema = z.object({
    client_name: z.string(),
    client_phone: z.string()
})

export async function GET() {
    const clients = await prisma.client.findMany()
    return NextResponse.json(clients)
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const existingClient = await prisma.client.findFirst({
            where: { client_phone: body.client_phone },
        });

        if (existingClient) {
            return NextResponse.json(
                { error: 'Já existe um cliente com esse telefone.' },
                { status: 409 } // ← status 409: conflito
            );
        }

        const valid = clientSchema.parse(body);
        const client = await prisma.client.create({
            data: valid,
        })
        return NextResponse.json(client, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Erro de validação", issues: error.errors },
                { status: 400 }
            );
        }
        console.log(error);

        return NextResponse.json(
            { error: "Erro interno do servidor" },
            {
                status: 500
            },
        );
    }
}
