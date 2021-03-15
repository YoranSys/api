const DiscordController = require('../controllers/DiscordController')
// const fp = require('fastify-plugin')
const { jokesTypes } = require('../utils')

const {
  jokesCount,
  randomJokeByType,
} = require('../controllers/JokeController')

const jwt = require('jsonwebtoken')
const axios = require('axios')

const { Users } = require('../models')

module.exports = async function (fastify) {
  fastify.addHook('preHandler', async (request, reply) => {
    const auth = request.cookies.auth

    if (auth) {
      const token = jwt.verify(auth, process.env.jwt_encryption_web)
      try {
        const { data } = await axios.get(
          'http://discordapp.com/api/users/@me',
          { headers: { Authorization: `Bearer ${token}` } },
        )
        const user = await Users.findOne({
          where: { user_id: data.id },
          raw: true,
        })
        request.session.user = user
      } catch (error) {
        console.error('Auth-Web:', error)
      }
    }
  })

  fastify.get('/', (request, reply) => {
    console.log('call')
    const joke = randomJokeByType('global').response
    joke.displayType = jokesTypes[joke]
    reply.view('home.ejs', {
      user: request.user,
      token: process.env.token,
      count: jokesCount(),
      randomJoke: joke,
    })
  })

  fastify.get('/account', (request, reply) => {
    // if (!request.user) {
    //   return reply.redirect('/login')
    // }
    // console.log(request.user)
    reply.view('account.ejs', {
      user: request.user,
    })
  })

  fastify.get('/login', DiscordController.redirect())
  fastify.get('/login/callback', DiscordController.callback())
}
