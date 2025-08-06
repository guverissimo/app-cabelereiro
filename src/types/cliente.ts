import z from "zod"

export type Client = z.infer<typeof clientSchema>

export const clientSchema = z.object({
    id: z.string(),
    client_name: z.string(),
    client_phone: z.string()
})
