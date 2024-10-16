import { expect, describe, it, beforeEach } from 'vitest'
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
})
