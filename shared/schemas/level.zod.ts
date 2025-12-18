import { z } from 'zod'

export const DirectionSchema = z.enum(['N', 'E', 'S', 'W'])
export const CommandSchema = z.enum(['MOVE', 'TURN_L', 'TURN_R', 'JUMP', 'LIGHT', 'P1'])
export const BlockTypeSchema = z.enum(['COMMAND', 'LOOP', 'IF_COLOR'])

export const TileTypeSchema = z.enum(['ground', 'void', 'switch', 'door', 'teleport', 'cracked'])

export const TileSchema = z.object({
    x: z.number(),
    y: z.number(),
    type: TileTypeSchema,
    height: z.number(),
    color: z.string().optional(),
    id: z.string().optional(),
    targetId: z.string().optional(),
    state: z.boolean().optional()
})

export const PositionSchema = z.object({
    x: z.number().min(0),
    y: z.number().min(0)
})

export const LevelSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    gridSize: z.number().min(1),
    layout: z.array(TileSchema),
    start: z.object({
        x: z.number().min(0),
        y: z.number().min(0),
        dir: DirectionSchema
    }),
    goals: z.array(PositionSchema),
    availableBlocks: z.array(z.union([CommandSchema, BlockTypeSchema])),
    maxCommands: z.number().min(1)
})

export const LevelsSchema = z.array(LevelSchema)

export type LevelData = z.infer<typeof LevelSchema>
