import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodyEsquema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodyEsquema.parse(request.body)

  const registerUseCase = makeRegisterUseCase()

  try {
    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (erro) {
    if (erro instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: erro.message })
    }
    throw erro
  }

  return reply.status(201).send()
}
