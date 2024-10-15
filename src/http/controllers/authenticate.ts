import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodyEsquema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodyEsquema.parse(request.body)

  const authenticateUseCase = makeAuthenticateUseCase()

  try {
    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (erro) {
    if (erro instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: erro.message })
    }
    throw erro
  }

  return reply.status(200).send()
}
