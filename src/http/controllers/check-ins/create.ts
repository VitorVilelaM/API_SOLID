import { makeCheckInsUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymID: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) >= -90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) >= -90
    }),
  })

  const { gymID } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const checkInUsecase = makeCheckInsUseCase()

  await checkInUsecase.execute({
    gymID,
    userID: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
