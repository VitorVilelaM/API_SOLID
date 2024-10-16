import { CheckIn } from '@prisma/client'
import { CheckInsRepositoy } from '@/repositories/chek-ins-repository'
interface FetchUserCheckInsHistoryUseCaseRequest {
  userID: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepositoy: CheckInsRepositoy) {}

  async execute({
    userID,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepositoy.findManyByUserId(userID, page)

    return { checkIns }
  }
}
