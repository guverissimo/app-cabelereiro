import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const scheduleSchema = z.object({
    collaborator_id: z.string(),
    day_of_week: z.number(),
    start_time: z.string(),
    end_time: z.string(),
    is_available: z.boolean()
})

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const collaboratorId = searchParams.get('collaborator_id');
        const dayOfWeek = searchParams.get('day_of_week');

        let where: any = {};

        if (collaboratorId) {
            where.collaborator_id = collaboratorId;
        }
        if (dayOfWeek) {
            where.day_of_week = parseInt(dayOfWeek);
        }

        const schedule = await prisma.schedule.findMany({
            where,
            orderBy: { day_of_week: 'asc' }
        });
        return NextResponse.json(schedule);
    } catch (error) {
        console.error('[GET_SCHEDULE_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = scheduleSchema.parse(body);

        const schedule = await prisma.schedule.create({
            data: validatedData,
        });

        return NextResponse.json(schedule, { status: 201 });
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

        console.error('[POST_SCHEDULE_ERROR]', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 