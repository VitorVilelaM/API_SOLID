import { makeFetchUsersCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-users-check-ins-history-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const fetchUsersCheckInsHistoryUseCase =
    makeFetchUsersCheckInsHistoryUseCase()

  const { checkIns } = await fetchUsersCheckInsHistoryUseCase.execute({
    userID: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
