import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInID: z.string().uuid(),
  })

  const { checkInID } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInUsecase = makeValidateCheckInUseCase()

  await validateCheckInUsecase.execute({
    checkInID,
  })

  return reply.status(204).send()
}
