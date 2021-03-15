const { generateKey, generateAPIToken } = require('../utils')

const { Users } = require('../models')

const {
  randomJoke,
  randomJokeByType,
  jokeById,
  types,
} = require('../controllers/JokeController')

module.exports = function (fastify, options, done) {
  fastify.register(require('../middlewares/auth-api'))

  fastify.get('/types', (request, reply) => {
    return reply.send({
      count: types.length,
      accepted_types: Object.keys(types),
      types,
    })
  })

  fastify.get('/random', (request, reply) => {
    const joke = randomJoke(request.query.disallow)
    if (joke.error) {
      return reply.code(400).send({
        status: 400,
        error: 'Bad Request',
        message: joke.message,
      })
    }

    return reply.code(200).send(joke.response)
  })

  fastify.get('/type/:type/random', (request, reply) => {
    const joke = randomJokeByType(request.params.type)
    if (joke.error) {
      return reply.code(400).send({
        status: 400,
        error: 'Bad Request',
        message: joke.message,
      })
    }

    return reply.code(200).send(joke.response)
  })

  fastify.get('/id/:id', (request, reply) => {
    const joke = jokeById(request.params.id)
    if (joke.error) {
      return reply.code(400).send({
        status: 400,
        error: 'Bad Request',
        message: joke.message,
      })
    }
    return reply.code(200).send(joke.response)
  })

  fastify.post('/regenerate', async (request, reply) => {
    if (!request.body || request.body.key !== request.auth.key) {
      return reply.code(400).send({
        status: 400,
        error: 'Bad Request',
        message: 'Key is missing',
      })
    }

    try {
      const key = generateKey()
      const token = await generateAPIToken(request.auth.user_id, key, 100)

      await Users.update(
        {
          token_key: key,
          token: token,
        },
        {
          where: { user_id: request.auth.user_id },
        },
      )

      return reply.code(200).send(token)
    } catch (error) {
      return reply.code(400).send({
        status: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      })
    }
  })

  fastify.get('*', (request, reply) => {
    return reply.send('Check documentation: https://www.blagues-api.fr/')
  })

  done()
}
