import { CheckIn } from '@prisma/client'
import { CheckInsRepositoy } from '@/repositories/chek-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinate } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checkins-error'

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
    userLatitude,
    userLongitude,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymID)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinate(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnsameDay = await this.checkInsRepositoy.findByUserIdOnDate(
      userID,
      new Date(),
    )

    if (checkInOnsameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepositoy.create({
      user_id: userID,
      gym_id: gymID,
    })

    return { checkIn }
  }
}
