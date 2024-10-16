import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepositoy {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
