import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './chek-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckinUseCase
describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckinUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymID: 'gym-01',
      userID: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice on the same day', async () => {
    const { checkIn } = await sut.execute({
      gymID: 'gym-01',
      userID: 'user-01',
    })

    await expect(() =>
      sut.execute({
        gymID: 'gym-01',
        userID: 'user-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymID: 'gym-01',
      userID: 'user-01',
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymID: 'gym-01',
      userID: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
