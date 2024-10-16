import { CheckIn } from '@prisma/client'
import { CheckInsRepositoy } from '@/repositories/chek-ins-repository'

interface CheckinUseCaseRequest {
  userID: string
  gymID: string
}

interface CheckinUseCaseResponse {
  checkIn: CheckIn
}

export class CheckinUseCase {
  constructor(private checkInsRepositoy: CheckInsRepositoy) {}

  async execute({
    userID,
    gymID,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const checkIn = await this.checkInsRepositoy.create({
      user_id: userID,
      gym_id: gymID,
    })

    return { checkIn }
  }
}
