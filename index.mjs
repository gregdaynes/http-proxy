import Fastify from 'fastify'

console.log(process.env.NODE_ENV)

const fastify = Fastify({
  logger: {
    transport:
      process.env.NODE_ENV === 'development'
        ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname'
          }
        }
        : undefined
  }
})

fastify.listen({ port: 3000 })
