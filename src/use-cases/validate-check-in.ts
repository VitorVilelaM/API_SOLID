import { CheckIn } from '@prisma/client'
import { CheckInsRepositoy } from '@/repositories/chek-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ValidateCheckinUseCaseRequest {
  userID: string
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

    checkIn.validated_at = new Date()

    await this.checkInsRepositoy.save(checkIn)

    return { checkIn }
  }
}
