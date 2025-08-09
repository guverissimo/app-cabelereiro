import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const appointmentSchema = z.object({
    client_name: z.string(),
    client_id: z.string().optional(),
    service_id: z.string(),
    price: z.number(),
    collaborator_id: z.string(),
    user_id: z.string().optional(),
    datetime: z.string().optional(),
    duration_minutes: z.number(),
    status: z.enum(['AGENDADO', 'CONCLUIDO', 'CANCELADO', 'NO_SHOW']).default('AGENDADO'),
    notes: z.string().optional()
})

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const collaboratorId = searchParams.get('collaborator_id');
        const date = searchParams.get('date');

        let where: any = {};

        if (status) {
            where.status = status;
        }
        if (collaboratorId) {
            where.collaborator_id = collaboratorId;
        }
        if (date) {
            where.datetime = {
                startsWith: date
            };
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                service: true,
                collaborator: true,
                client: true
            },
            orderBy: { datetime: 'asc' }
        });
        return NextResponse.json(appointments);
    } catch (error) {
        console.error('[GET_APPOINTMENTS_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = appointmentSchema.parse(body);

        const appointment = await prisma.appointment.create({
            data: validatedData,
            include: {
                service: true,
                collaborator: true,
                client: true
            }
        });

        return NextResponse.json(appointment, { status: 201 });
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

        console.error('[POST_APPOINTMENT_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 