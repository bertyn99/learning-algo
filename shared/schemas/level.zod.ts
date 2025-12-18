import { z } from 'zod'

export const DirectionSchema = z.enum(['N', 'E', 'S', 'W'])
export const CommandSchema = z.enum(['MOVE', 'TURN_L', 'TURN_R', 'LIGHT'])
export const CellTypeSchema = z.union([z.literal(0), z.literal(1), z.literal(2)])

export const PositionSchema = z.object({
    x: z.number().min(0),
    y: z.number().min(0)
})

export const LevelSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    gridSize: z.number().min(1),
    layout: z.array(CellTypeSchema),
    start: z.object({
        x: z.number().min(0),
        y: z.number().min(0),
        dir: DirectionSchema
    }),
    goals: z.array(PositionSchema),
    availableBlocks: z.array(CommandSchema),
    maxCommands: z.number().min(1)
})

export const LevelsSchema = z.array(LevelSchema)

export type LevelData = z.infer<typeof LevelSchema>

