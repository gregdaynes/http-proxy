import { parseArgs } from 'node:util'
import { readFileSync } from 'node:fs'
import Fastify from 'fastify'
import Proxy from '@fastify/http-proxy'
import envSchema from 'env-schema'
import S from 'fluent-json-schema'

const envars = envSchema({
  schema: S.object()
    .prop('port', S.number().default(3000).required())
    .prop('host', S.string().default('127.0.0.1').required())
    .prop('cert', S.string())
    .prop('key', S.string())
    .prop('proxy', S.array().items(S.string()))
})

const { values, positionals } = parseArgs({
  options: {
    port: {
      type: 'string',
      short: 'p'
    },
    host: {
      type: 'boolean',
      short: 'h'
    },
    cert: {
      type: 'string',
      short: 'c'
    },
    key: {
      type: 'string',
      short: 'k'
    },
    proxy: {
      type: 'string',
      multiple: true
    }
  }
})

const config = { ...envars, ...values, positionals }
config.https = !!(config.key && config.cert)
config.host = values.host ? '0.0.0.0' : envars.host

try {
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

  if (values.proxy?.length) {
    for (const route of values.proxy) {
      const [options, ...rest] = route.split(':')
      const [prefix, rewritePrefix] = options.split(',')
      const upstream = rest.join(':')

      fastify.register(Proxy, {
        upstream,
        prefix,
        rewritePrefix
      })
    }
  }

  fastify.listen(config)
} catch (err) {
  console.error(err)
  process.exit(1)
}
