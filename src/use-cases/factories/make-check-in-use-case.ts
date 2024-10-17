import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckinUseCase } from '../chek-in'

export function makeCheckInsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const prismaGymsRepository = new PrismaGymsRepository()

  const useCase = new CheckinUseCase(
    prismaCheckInsRepository,
    prismaGymsRepository,
  )

  return useCase
}
