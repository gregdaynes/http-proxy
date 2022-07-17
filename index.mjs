import { parseArgs } from "node:util"
import { readFileSync } from 'node:fs'
import Fastify from 'fastify'
import envSchema  from 'env-schema'
import S from 'fluent-json-schema'

const envars = envSchema({
  schema: S.object()
    .prop('port', S.number().default(3000).required())
    .prop('host', S.string().default('127.0.0.1').required())
    .prop('cert', S.string())
    .prop('key', S.string())
})

const { values, positionals } = parseArgs({ options: {
  port: {
    type: "string",
    short: "p"
  },
  host: {
    type: "string",
    short: "h"
  },
  cert: {
    type: 'string',
    short: 'c'
  },
  key: {
    type: 'string',
    short: 'k'
  },
}})

const config = { ...envars, ...values, positionals }
config.https = !!(config.key && config.cert)

const fastify = Fastify({
  https:
    config.https
      ? {
        allowHTTP1: true,
        key: readFileSync(config.key),
        cert: readFileSync(config.cert)
      }
      : undefined,
  logger: true
})

fastify.get('/', (request, reply) => {
  return { Hello: "World" }
})

fastify.listen({ host: config.host, port: config.port })
