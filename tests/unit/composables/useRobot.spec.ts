import { describe, it, expect } from 'vitest'
import { useRobot } from '../../../app/composables/game/useRobot'

describe('useRobot', () => {
    const robot = useRobot()

    it('should return correct direction deltas', () => {
        expect(robot.getDirectionDelta('N')).toEqual({ dx: 0, dy: -1 })
        expect(robot.getDirectionDelta('E')).toEqual({ dx: 1, dy: 0 })
        expect(robot.getDirectionDelta('S')).toEqual({ dx: 0, dy: 1 })
        expect(robot.getDirectionDelta('W')).toEqual({ dx: -1, dy: 0 })
    })

    it('should calculate left turns correctly', () => {
        expect(robot.getTurnLeftDirection('N')).toBe('W')
        expect(robot.getTurnLeftDirection('W')).toBe('S')
        expect(robot.getTurnLeftDirection('S')).toBe('E')
        expect(robot.getTurnLeftDirection('E')).toBe('N')
    })

    it('should calculate right turns correctly', () => {
        expect(robot.getTurnRightDirection('N')).toBe('E')
        expect(robot.getTurnRightDirection('E')).toBe('S')
        expect(robot.getTurnRightDirection('S')).toBe('W')
        expect(robot.getTurnRightDirection('W')).toBe('N')
    })
})

