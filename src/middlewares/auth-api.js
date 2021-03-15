const fp = require('fastify-plugin')
const jwt = require('jsonwebtoken')

module.exports = fp(async function (fastify) {
  fastify.addHook('onRequest', async (request, reply) => {
    const bearerToken = request.header('Authorization')
    if (!bearerToken) {
      return reply.code(401).send({
        status: 401,
        error: 'Unauthorized',
        message: 'Authorization header is required',
      })
    } else if (bearerToken.substring(0, 7) !== 'Bearer ') {
      return reply.code(401).send({
        status: 401,
        error: 'Unauthorized',
        message:
          'Authorization header value must follow the Bearer <token> format',
      })
    }
    const token = bearerToken.split(' ')[1] || null
    try {
      const decoded = jwt.verify(token, process.env.jwt_encryption_api)
      request.auth = decoded
      console.log(`API call: ${decoded.user_id}`)
    } catch (error) {
      return reply.code(401).send({
        status: 401,
        error: 'Unauthorized',
        message: 'Invalid Token submitted',
      })
    }
  })
})
