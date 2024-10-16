import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './chek-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckinUseCase
let gymsRepository: InMemoryGymsRepository

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      latitude: new Decimal(-21.8012227),
      longitude: new Decimal(-46.5644216),
      phone: '',
    })
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymID: 'gym-01',
      userID: 'user-01',
      userLatitude: -21.8012227,
      userLongitude: -46.5644216,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice on the same day', async () => {
    const { checkIn } = await sut.execute({
      gymID: 'gym-01',
      userID: 'user-01',
      userLatitude: -21.8012227,
      userLongitude: -46.5644216,
    })

    if (!checkIn) {
      console.log(true)
    }

    await expect(() =>
      sut.execute({
        gymID: 'gym-01',
        userID: 'user-01',
        userLatitude: -21.8012227,
        userLongitude: -46.5644216,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymID: 'gym-01',
      userID: 'user-01',
      userLatitude: -21.8012227,
      userLongitude: -46.5644216,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymID: 'gym-01',
      userID: 'user-01',
      userLatitude: -21.8012227,
      userLongitude: -46.5644216,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      latitude: new Decimal(-16.1646898),
      longitude: new Decimal(-42.2847217),
      phone: '',
    })

    await expect(() =>
      sut.execute({
        gymID: 'gym-02',
        userID: 'user-01',
        userLatitude: -21.8012227,
        userLongitude: -46.5644216,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
