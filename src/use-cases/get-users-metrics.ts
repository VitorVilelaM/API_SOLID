import { CheckInsRepositoy } from '@/repositories/chek-ins-repository'
interface GetUserMetricsUseCaseeRequest {
  userID: string
}

interface GetUserMetricsUseCaseeResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepositoy: CheckInsRepositoy) {}

  async execute({
    userID,
  }: GetUserMetricsUseCaseeRequest): Promise<GetUserMetricsUseCaseeResponse> {
    const checkInsCount = await this.checkInsRepositoy.countByUserId(userID)

    return { checkInsCount }
  }
}
