const moment = require('moment')
const jwt = require('jsonwebtoken')

const random = items => {
  return items[Math.floor(Math.random() * items.length)]
}

const generateAPIToken = (userId, key, limit) => {
  return jwt.sign(
    {
      user_id: userId,
      limit,
      key,
      created_at: moment().format(),
    },
    process.env.jwt_encryption_api,
  )
}

const generateKey = () => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 50; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const jokesTypes = {
  limit: 'Blague limite limite',
  global: 'Blague normale',
  dark: 'Blague humour noir',
  dev: 'Blague de développeurs',
  beauf: 'Humour de beaufs',
  blondes: 'Blagues blondes',
}

module.exports = {
  generateAPIToken,
  random,
  generateKey,
  jokesTypes,
}
