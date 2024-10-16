import { CheckIn } from '@prisma/client'
import { CheckInsRepositoy } from '@/repositories/chek-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckinUseCaseRequest {
  checkInID: string
}

interface ValidateCheckinUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckinUseCase {
  constructor(private checkInsRepositoy: CheckInsRepositoy) {}

  async execute({
    checkInID,
  }: ValidateCheckinUseCaseRequest): Promise<ValidateCheckinUseCaseResponse> {
    const checkIn = await this.checkInsRepositoy.findById(checkInID)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepositoy.save(checkIn)

    return { checkIn }
  }
}
