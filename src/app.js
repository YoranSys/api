const fastify = require('fastify')
const fastifyStatic = require('fastify-static')
const fastifySession = require('fastify-session')
const fastifyCookie = require('fastify-cookie')
const path = require('path')

const app = fastify({
  logger: false,
})

app.register(require('point-of-view'), {
  engine: { ejs: require('ejs') },
  root: path.join(__dirname, 'views'),
})

app.register(fastifyCookie)
app.register(fastifySession, {
  secret: process.env.cookie_secret || 'random key',
})

// attention si ça bug c'est ici
app.register(require('fastify-cors'))

// first plugin
app.register(fastifyStatic, {
  root: path.join(__dirname, './public'),
  prefix: '/files/',
})

// second plugin
app.register(fastifyStatic, {
  root: path.join(__dirname, '../build'),
  decorateReply: false,
})

app.register(require('./router/website'))

// app.register(require('./router/api'), { prefix: 'api' })

module.exports = app
