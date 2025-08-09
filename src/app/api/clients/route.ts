import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const clientSchema = z.object({
    client_name: z.string(),
    client_phone: z.string()
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  const clients = query
    ? await prisma.client.findMany({
        where: {
          OR: [
            { client_name: { contains: query, mode: "insensitive" } },
            { client_phone: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 10,
        orderBy: { client_name: "asc" },
      })
    : await prisma.client.findMany({
        take: 10,
        orderBy: { client_name: "asc" },
      });

  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const validatedData = clientSchema.parse(body)

        const existingClient = await prisma.client.findFirst({
            where: { client_phone: validatedData.client_phone },
        })

        if (existingClient) {
            return NextResponse.json(
                { error: 'Já existe um cliente com esse telefone.' },
                { status: 409 }
            )
        }

        const client = await prisma.client.create({
            data: validatedData,
        })

        return NextResponse.json(client, { status: 201 })
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

        console.error('[POST_CLIENT_ERROR]', error)

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
