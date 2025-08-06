import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const appointmentUpdateSchema = z.object({
    client_name: z.string().optional(),
    service_id: z.string().optional(),
    price: z.number().optional(),
    collaborator_id: z.string().optional(),
    datetime: z.string().optional(),
    duration_minutes: z.number().optional(),
    status: z.enum(['AGENDADO', 'CONCLUIDO', 'CANCELADO']).optional()
})

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const validatedData = appointmentUpdateSchema.parse(body);

        const appointment = await prisma.appointment.update({
            where: { id: params.id },
            data: validatedData,
        });

        return NextResponse.json(appointment);
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

        console.error('[PUT_APPOINTMENT_ERROR]', error);
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
        await prisma.appointment.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Agendamento deletado com sucesso' });
    } catch (error) {
        console.error('[DELETE_APPOINTMENT_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 