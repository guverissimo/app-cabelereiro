import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const client_phone = searchParams.get("value");

    if (!client_phone) {
      return NextResponse.json({ error: "Telefone é obrigatório" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { client_phone },
    });

    if (!client) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Erro ao buscar cliente por telefone:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
