import z from "zod"

export type collaborator = z.infer<typeof collaboratorSchema>

export const collaboratorSchema = z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    email: z.email(),

})
