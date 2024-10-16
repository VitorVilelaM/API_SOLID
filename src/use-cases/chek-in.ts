import { CheckIn } from '@prisma/client'
import { CheckInsRepositoy } from '@/repositories/chek-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CheckinUseCaseRequest {
  userID: string
  gymID: string
  userLatitude: number
  userLongitude: number
}

interface CheckinUseCaseResponse {
  checkIn: CheckIn
}

export class CheckinUseCase {
  constructor(
    private checkInsRepositoy: CheckInsRepositoy,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userID,
    gymID,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymID)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkInOnsameDay = await this.checkInsRepositoy.findByUserIdOnDate(
      userID,
      new Date(),
    )

    if (checkInOnsameDay) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepositoy.create({
      user_id: userID,
      gym_id: gymID,
    })

    return { checkIn }
  }
}
